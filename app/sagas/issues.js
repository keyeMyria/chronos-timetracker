// @flow
import { delay } from 'redux-saga';
import { call, take, select, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { ipcRenderer } from 'electron';
import * as Api from 'api';
import merge from 'lodash.merge';
import Raven from 'raven-js';
import {
  getSelectedProject,
  getSelectedProjectId,
  getSelectedSprintId,
  getFieldIdByName,
  getUserData,
  getRecentIssueIds,
  getIssuesSearchValue,
  getFoundIssueIds,
  getIssueFilters,
  getSelectedIssueId,
  getIssueViewTab,
  getSelectedProjectType,
} from 'selectors';
import { issuesActions, types } from 'actions';
import normalizePayload from 'normalize-util';

import { throwError, infoLog, notify } from './ui';
import { getAdditionalWorklogsForIssues } from './worklogs';

import type {
  FetchIssuesRequestAction,
  Project,
  Id,
  User,
  IssueFilters,
  SelectIssueAction,
} from '../types';

export function* fetchIssues({
  payload: { startIndex, stopIndex, search },
}: FetchIssuesRequestAction): Generator<*, *, *> {
  try {
    yield call(
      infoLog,
      'started fetchIssues',
    );
    yield put(issuesActions.setIssuesFetching(true));
    if (search) {
      yield put(issuesActions.setIssuesTotalCount(0));
      yield put(issuesActions.clearFoundIssueIds());
    }
    const epicLinkFieldId: string | null = yield select(getFieldIdByName, 'Epic Link');
    const selectedProject: Project | null = yield select(getSelectedProject);
    const selectedProjectId: string | null = yield select(getSelectedProjectId);
    const selectedProjectType: string | null = yield select(getSelectedProjectType);
    const selectedSprintId: Id = yield select(getSelectedSprintId);
    const searchValue: string = yield select(getIssuesSearchValue);
    const filters: IssueFilters = yield select(getIssueFilters);
    const opts = {
      startIndex,
      stopIndex,
      projectId: selectedProjectId,
      projectType: selectedProjectType || 'project',
      sprintId: selectedSprintId,
      searchValue,
      projectKey: selectedProject && selectedProject.key,
      filters,
      epicLinkFieldId,
    };
    const response = yield call(Api.fetchIssues, opts);
    yield call(
      infoLog,
      'fetchIssues response',
      response,
    );
    const incompleteIssues = response.issues.filter(issue => issue.fields.worklog.total > 20);
    const normalizedIssues = yield call(normalizePayload, response.issues, 'issues');
    if (incompleteIssues.length) {
      yield call(
        infoLog,
        'found issues lacking worklogs',
        incompleteIssues,
      );
      const _issues = yield call(getAdditionalWorklogsForIssues, incompleteIssues);
      yield call(
        infoLog,
        'getAdditionalWorklogsForIssues response:',
        _issues,
      );

      merge(normalizedIssues.map, _issues);
      yield call(
        infoLog,
        'filled issues with lacking worklogs: ',
        normalizedIssues.map,
      );
    }
    const selectedIssueId = yield select(getSelectedIssueId);
    if (normalizedIssues.ids.includes(selectedIssueId)) {
      yield put(issuesActions.selectIssue(normalizedIssues.map[selectedIssueId]));
    }
    yield put(issuesActions.setIssuesTotalCount(response.total));
    yield put(issuesActions.addIssues(normalizedIssues));
    if (search) {
      yield put(issuesActions.fillFoundIssueIds(normalizedIssues.ids));
    } else {
      const foundIssueIds = yield select(getFoundIssueIds);
      if (foundIssueIds.length !== 0) {
        yield put(issuesActions.addFoundIssueIds(normalizedIssues.ids));
      }
    }
    yield put(issuesActions.setIssuesFetching(false));
  } catch (err) {
    yield put(issuesActions.setIssuesFetching(false));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchFetchIssuesRequest(): Generator<*, *, *> {
  yield takeEvery(types.FETCH_ISSUES_REQUEST, fetchIssues);
}

export function* fetchRecentIssues(): Generator<*, *, *> {
  try {
    yield call(
      infoLog,
      'started fetchRecentIssues',
    );
    yield put(issuesActions.setRecentIssuesFetching(true));
    const selectedProjectId: string | null = yield select(getSelectedProjectId);
    const selectedProjectType: string | null = yield select(getSelectedProjectType);
    const selectedSprintId: Id = yield select(getSelectedSprintId);
    const self: User = yield select(getUserData);
    const opts = {
      projectId: selectedProjectId,
      projectType: selectedProjectType || 'project',
      sprintId: selectedSprintId,
      worklogAuthor: self.key,
    };
    const response = yield call(Api.fetchRecentIssues, opts);
    yield call(
      infoLog,
      'fetchRecentIssues response:',
      response,
    );
    const issues = response.issues;

    const incompleteIssues = response.issues.filter(issue => issue.fields.worklog.total > 20);
    const normalizedIssues = yield call(normalizePayload, issues, 'issues');
    if (incompleteIssues.length) {
      yield call(
        infoLog,
        'found issues lacking worklogs',
        incompleteIssues,
      );
      const _issues = yield call(getAdditionalWorklogsForIssues, incompleteIssues);
      yield call(
        infoLog,
        'getAdditionalWorklogsForIssues response:',
        _issues,
      );

      merge(normalizedIssues.map, _issues);
      yield call(
        infoLog,
        'filled issues with lacking worklogs: ',
        normalizedIssues.map,
      );
    }
    yield put(issuesActions.addIssues(normalizedIssues));
    yield put(issuesActions.fillRecentIssueIds(normalizedIssues.ids));
    /* TODO
    if (showWorklogTypes) {
      const recentWorkLogsIds = yield select(
        state => state.worklogs.meta.recentWorkLogsIds.toArray(),
      );
      const worklogsFromChronosBackend
        = yield call(fetchChronosBackendWorklogs, recentWorkLogsIds);
      yield put({
        type: types.MERGE_WORKLOGS_TYPES,
        payload: worklogsFromChronosBackend.filter(w => w.worklogType),
      });
    }
    */
    yield put(issuesActions.setRecentIssuesFetching(false));
  } catch (err) {
    yield put(issuesActions.setRecentIssuesFetching(false));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

function* getIssueTransitions(issueId: string): Generator<*, void, *> {
  try {
    yield put(issuesActions.setAvailableTransitionsFetching(true));
    yield call(
      infoLog,
      `getting available issue transitions for ${issueId}`,
    );
    const { transitions } = yield call(Api.getIssueTransitions, issueId);
    yield call(
      infoLog,
      `got issue ${issueId} available transitions`,
      transitions,
    );
    yield put(issuesActions.fillAvailableTransitions(transitions));
    yield put(issuesActions.setAvailableTransitionsFetching(false));
  } catch (err) {
    yield put(issuesActions.setAvailableTransitionsFetching(false));
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* fetchIssueTypes(): Generator<*, *, *> {
  try {
    const issueTypes = yield call(Api.fetchIssueTypes);
    const normalizedData = normalizePayload(issueTypes, 'issueTypes');
    yield put(issuesActions.fillIssueTypes(normalizedData));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* fetchIssueStatuses(): Generator<*, *, *> {
  try {
    const issueStatuses = yield call(Api.fetchIssueStatuses);
    const normalizedData = normalizePayload(issueStatuses, 'issueStatuses');
    yield put(issuesActions.fillIssueStatuses(normalizedData));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

function* onSidebarTabChange({ payload }: { payload: string }): Generator<*, *, *> {
  try {
    const tab: string = payload;
    const recentIssueIds: Array<Id> = yield select(getRecentIssueIds);
    if (tab === 'recent' && recentIssueIds.length === 0) {
      yield fork(fetchRecentIssues);
    }
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* watchSidebarTabChange(): Generator<*, *, *> {
  yield takeEvery(types.SET_SIDEBAR_TYPE, onSidebarTabChange);
}

function* handleIssueFiltersChange(): Generator<*, *, *> {
  yield call(delay, 500);
  yield put(issuesActions.fetchIssuesRequest({ startIndex: 0, stopIndex: 10, search: true }));
}

export function* watchFiltersChange(): Generator<*, *, *> {
  yield takeLatest(
    [types.SET_ISSUES_SEARCH_VALUE, types.SET_ISSUES_FILTER],
    handleIssueFiltersChange,
  );
}

export function* issueSelectFlow({ payload, meta }: SelectIssueAction): Generator<*, *, *> {
  const issueViewTab = yield select(getIssueViewTab);
  if (payload) {
    yield fork(getIssueTransitions, payload.id);
    if (payload) {
      const issueKey = payload.key;
      ipcRenderer.send('select-issue', issueKey);
    }
  }
  if (meta && issueViewTab === 'Worklogs') {
    yield call(delay, 500);
    const worklogEl = document.querySelector(`#worklog-${meta.id}`);
    if (worklogEl) {
      worklogEl.scrollIntoView({ behavior: 'smooth' });
      worklogEl.className += ' blink';
      yield call(delay, 2000);
      if (worklogEl) {
        worklogEl.className = worklogEl.className.slice(0, -6);
      }
    }
  }
}

export function* watchIssueSelect(): Generator<*, void, *> {
  yield takeEvery(types.SELECT_ISSUE, issueSelectFlow);
}

export function* transitionIssueFlow(): Generator<*, void, *> {
  try {
    while (true) {
      const { payload, meta } = yield take(types.TRANSITION_ISSUE_REQUEST);
      const issue = meta;
      const transition = payload;
      yield call(Api.transitionIssue, issue.id, transition.id);
      yield put(issuesActions.setIssueStatus(transition.to, issue));
      const newIssue = {
        ...issue,
        fields: {
          ...issue.fields,
          status: transition.to,
        },
      };
      yield put(issuesActions.selectIssue(newIssue));
      yield call(notify,
        '',
        `Moved issue ${issue.key} to ${transition.to.name}`,
      );
    }
  } catch (err) {
    yield call(notify,
      '',
      'Issue transition failed. Probably no permission',
    );
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* assignIssueFlow(): Generator<*, void, *> {
  try {
    while (true) {
      const { payload } = yield take(types.ASSIGN_ISSUE_REQEST);
      const issue = payload;
      const userData = yield select(getUserData);
      yield call(
        infoLog,
        `assigning issue ${issue.key} to self (${userData.key})`,
      );
      yield call(Api.assignIssue, { issueKey: issue.key, assignee: userData.key });
      yield call(
        infoLog,
        `succesfully assigned issue ${issue.key} to self (${userData.key})`,
      );
      yield put(issuesActions.setIssueAssignee(userData, issue));
      const newIssue = {
        ...issue,
        fields: {
          ...issue.fields,
          assignee: userData,
        },
      };
      yield put(issuesActions.selectIssue(newIssue));
      yield call(
        notify,
        '',
        `${issue.key} is assigned to you`,
      );
    }
  } catch (err) {
    yield call(notify,
      '',
      'Cannot assign issue. Probably no permission',
    );
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* fetchIssueFields(): Generator<*, void, *> {
  try {
    yield call(infoLog, 'fetching issue fields');
    const issueFields = yield call(Api.fetchIssueFields);
    yield call(infoLog, 'got issue fields', issueFields);
    yield put(issuesActions.fillIssueFields(issueFields));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}

export function* fetchEpics(): Generator<*, void, *> {
  try {
    yield call(infoLog, 'fetching epics');
    const { issues } = yield call(Api.fetchEpics);
    yield call(infoLog, 'got epics', issues);
    const normalizedEpics = yield call(normalizePayload, issues, 'epics');
    yield put(issuesActions.fillEpics(normalizedEpics));
  } catch (err) {
    yield call(throwError, err);
    Raven.captureException(err);
  }
}
