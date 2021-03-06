// @flow
import type { Action } from './index';
import type { FieldType } from './reduxForm';

export type ArrayInsertAction = {
  type: string,
  meta: { form: string, field: string, index: number },
  payload: any
} & Action
export type ArrayInsert = {
  (form: string, field: string, index: number, value: any): ArrayInsertAction
}
export type ArrayMoveAction = {
  type: string,
  meta: { form: string, field: string, from: number, to: number }
} & Action
export type ArrayMove = {
  (form: string, field: string, from: number, to: number): ArrayMoveAction
}
export type ArrayPopAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
export type ArrayPop = { (form: string, field: string): ArrayPopAction }
export type ArrayPushAction = {
  type: string,
  meta: { form: string, field: string },
  payload: any
} & Action
export type ArrayPush = {
  (form: string, field: string, value: any): ArrayPushAction
}
export type ArrayRemoveAction = {
  type: string,
  meta: { form: string, field: string, index: number }
} & Action
export type ArrayRemove = {
  (form: string, field: string, index: number): ArrayRemoveAction
}
export type ArrayRemoveAllAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
export type ArrayRemoveAll = {
  (form: string, field: string): ArrayRemoveAllAction
}
export type ArrayShiftAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
export type ArrayShift = { (form: string, field: string): ArrayShiftAction }
export type ArraySpliceAction = {
  type: string,
  meta: {
    form: string,
    field: string,
    index: number,
    removeNum: number
  },
  payload?: any
} & Action
export type ArraySplice = {
  (
    form: string,
    field: string,
    index: number,
    removeNum: number,
    value: any
  ): ArraySpliceAction
}
export type ArraySwapAction = {
  type: string,
  meta: { form: string, field: string, indexA: number, indexB: number }
} & Action
export type ArraySwap = {
  (form: string, field: string, indexA: number, indexB: number): ArraySwapAction
}
export type ArrayUnshiftAction = {
  type: string,
  meta: { form: string, field: string },
  payload: any
} & Action
export type ArrayUnshift = {
  (form: string, field: string, value: any): ArrayUnshiftAction
}
export type AutofillAction = {
  type: string,
  meta: { form: string, field: string },
  payload: any
} & Action
export type Autofill = {
  (form: string, field: string, value: any): AutofillAction
}
export type BlurAction = {
  type: string,
  meta: { form: string, field: string, touch: boolean },
  payload: any
} & Action
export type Blur = {
  (form: string, field: string, value: any, touch: boolean): BlurAction
}
export type ChangeAction = {
  type: string,
  meta: {
    form: string,
    field: string,
    touch: boolean,
    persistentSubmitErrors: boolean
  },
  payload: any
} & Action
export type Change = {
  (
    form: string,
    field: string,
    value: any,
    touch: boolean,
    persistentSubmitErrors: boolean
  ): ChangeAction
}
export type ClearSubmitAction = {
  type: string,
  meta: { form: string }
} & Action
export type ClearSubmit = { (form: string): ClearSubmitAction }
export type ClearSubmitErrorsAction = {
  type: string,
  meta: { form: string }
} & Action
export type ClearSubmitErrors = { (form: string): ClearSubmitErrorsAction }
export type ClearAsyncErrorAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
export type ClearAsyncError = {
  (form: string, field: string): ClearAsyncErrorAction
}
export type DestroyAction = { type: string, meta: { form: string[] } } & Action
export type Destroy = { (...forms: string[]): DestroyAction }
export type FocusAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
export type Focus = { (form: string, field: string): FocusAction }
export type InitializeAction = {
  type: string,
  meta: { form: string, keepDirty: boolean },
  payload: Object
} & Action
export type Initialize = {
  (
    form: string,
    values: Object,
    keepDirty: boolean,
    otherMeta: Object
  ): InitializeAction
}
export type RegisterFieldAction = {
  type: string,
  meta: { form: string },
  payload: { name: string, type: FieldType }
} & Action
export type RegisterField = {
  (form: string, name: string, type: FieldType): RegisterFieldAction
}
export type ResetAction = { type: string, meta: { form: string } } & Action
export type Reset = { (form: string): ResetAction }
export type StartAsyncValidationAction = {
  type: string,
  meta: { form: string, field: string }
} & Action
export type StartAsyncValidation = {
  (
    form: string,
    field: string,
    index: number,
    value: any
  ): StartAsyncValidationAction
}
export type StartSubmitAction = {
  type: string,
  meta: { form: string }
} & Action
export type StartSubmit = { (form: string): StartSubmitAction }
export type StopAsyncValidationAction = {
  type: string,
  meta: { form: string },
  payload: ?Object,
  error: boolean
} & Action
export type StopAsyncValidation = {
  (form: string, errors: ?Object): StopAsyncValidationAction
}
export type StopSubmitAction = {
  type: string,
  meta: { form: string },
  payload: ?Object,
  error: boolean
} & Action
export type StopSubmit = { (form: string, errors: ?Object): StopSubmitAction }
export type SubmitAction = { type: string, meta: { form: string } } & Action
export type Submit = { (form: string): SubmitAction }
export type SetSubmitFailedAction = {
  type: string,
  meta: { form: string, fields: string[] },
  error: true
} & Action
export type SetSubmitFailed = {
  (form: string, ...fields: string[]): SetSubmitFailedAction
}
export type SetSubmitSucceededAction = {
  type: string,
  meta: { form: string, fields: string[] },
  error: false
} & Action
export type SetSubmitSucceeded = {
  (form: string, ...fields: string[]): SetSubmitSucceededAction
}
export type TouchAction = {
  type: string,
  meta: { form: string, fields: string[] }
} & Action
export type Touch = { (form: string, ...fields: string[]): TouchAction }
export type UnregisterFieldAction = {
  type: string,
  meta: { form: string },
  payload: { name: string, destroyOnUnmount: boolean }
} & Action
export type UnregisterField = {
  (form: string, name: string, destroyOnUnmount: boolean): UnregisterFieldAction
}
export type UntouchAction = {
  type: string,
  meta: { form: string, fields: string[] }
} & Action
export type Untouch = { (form: string, ...fields: string[]): UntouchAction }
export type UpdateSyncErrorsAction = {
  type: string,
  meta: { form: string },
  payload: { syncErrors: Object, error: any }
} & Action
export type UpdateSyncErrors = {
  (form: string, syncErrors: Object, error: any): UpdateSyncErrorsAction
}
export type UpdateSyncWarningsAction = {
  type: string,
  meta: { form: string },
  payload: { syncWarnings: Object, warning: any }
} & Action
export type UpdateSyncWarnings = {
  (form: string, syncWarnings: Object, warning: any): UpdateSyncWarningsAction
}

export type Actions = {
  arrayInsert: ArrayInsert,
  arrayMove: ArrayMove,
  arrayPop: ArrayPop,
  arrayPush: ArrayPush,
  arrayRemove: ArrayRemove,
  arrayRemoveAll: ArrayRemoveAll,
  arrayShift: ArrayShift,
  arraySplice: ArraySplice,
  arraySwap: ArraySwap,
  arrayUnshift: ArrayUnshift,
  autofill: Autofill,
  blur: Blur,
  change: Change,
  clearSubmit: ClearSubmit,
  clearSubmitErrors: ClearSubmitErrors,
  clearAsyncError: ClearAsyncError,
  destroy: Destroy,
  focus: Focus,
  initialize: Initialize,
  registerField: RegisterField,
  reset: Reset,
  startAsyncValidation: StartAsyncValidation,
  startSubmit: StartSubmit,
  stopAsyncValidation: StopAsyncValidation,
  stopSubmit: StopSubmit,
  submit: Submit,
  setSubmitFailed: SetSubmitFailed,
  setSubmitSucceeded: SetSubmitSucceeded,
  touch: Touch,
  unregisterField: UnregisterField,
  untouch: Untouch,
  updateSyncErrors: UpdateSyncErrors,
  updateSyncWarnings: UpdateSyncWarnings
}

export type ReduxFormAction =
  ArrayInsertAction | ArrayMoveAction | ArrayPopAction | ArrayPushAction | ArrayRemoveAction |
  ArrayRemoveAllAction | ArrayShiftAction | ArraySpliceAction | ArraySwapAction |
  ArrayUnshiftAction | AutofillAction | BlurAction | ChangeAction | ClearSubmitAction |
  ClearSubmitErrorsAction | ClearAsyncErrorAction | DestroyAction | FocusAction |
  InitializeAction | RegisterFieldAction | ResetAction | StartAsyncValidationAction |
  StartSubmitAction | StopAsyncValidationAction | StopSubmitAction | SubmitAction |
  SetSubmitFailedAction | SetSubmitSucceededAction | TouchAction | UnregisterFieldAction |
  UntouchAction | UpdateSyncErrorsAction | UpdateSyncWarningsAction;
