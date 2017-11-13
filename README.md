# Purpose

Redux Form v6 was a [major departure](https://redux-form.com/7.1.2/docs/migrationguide.md/#inversion-of-control) from previous versions. A direct upgrade
from v5 to v6 would require practically rewriting every form in your application all at once, as no incremental upgrade path was provided. For any reasonbly large project, that is untennable.

This compatibility module (`redux-form-compat`) provides a (rough) incremental upgrade path.

The inversion of control can now be deferred on a form-by-form basis, relieving the major upgrade burden. The other migration steps must still be followed though as it is not our goal to provide full backwards compatibility.

# Features

 * Supports `fields` argument to `@reduxForm`.
 * Supports `mapStateToProps` and `mapDispatchToProps`.
 * Supports deep fields.
 * Does not support legacy field arrays. They will need to be converted to use `FieldArray`, though other fields within the same form can continue to use `fields` instead of `Field`.
 * Supports choice of v5-style field props, v6-style, or a combination thereof.

# Usage

1. Upgrade `redux-form` to the latest version (7.1.2 was tested).
1. Replace `import { reduxForm } from 'redux-form'` with `import { reduxForm } from 'redux-form-compat'`.
1. Follow the other steps in the [migration guide](https://redux-form.com/7.1.2/docs/migrationguide.md/).
    1. `handleSubmit`/`onSubmit` should throw `SubmissionError`.
    1. Convert field arrays to use `FieldArray`.
    1. If normalization is used, those fields will need to be converted to either avoid normalization or use the new normalization.

Undocumented differences found when upgrading from redux-form 5.3.6 to 7.1.2:

 * The synchronous `validate` function will no loger receive empty
   objects when none of the nested fields have values.
 * The `checked` prop is no longer passed for boolean values, despite [documentation to the contrary](https://redux-form.com/7.1.2/docs/api/field.md/#-code-input-checked-boolean-code-optional-). In v5, the `checked` prop was [always](https://github.com/erikras/redux-form/blob/v5.3.6/src/isChecked.js) passed, with a value of `true`, `false`, or `undefined`.
 * `onChange` no longer [magically unwraps](https://github.com/erikras/redux-form/commit/d33ca58b4c14ac82a5230aa916191a07ee43f127) objects that have a `.value` field.
## Further migration steps:

These can be done at your leisure and don't need to be applied to the whole project at once.

1. Pass `fieldPropStyle: 'v5v6'` when your code is ready to start receiving the `input` and `meta`. Change to `'v6'` when the old-style props are no longer needed.
1. Convert fields to use `Field`. (This can be done on an individual field basis.)
1. If you pass more than one argument to `reduxForm`, switch the additional arguments to use `@connect`.
1. Change imports back to `import { reduxForm } from 'redux-form'`.
1. Remove any `fieldPropStyle` options you may have added. (They are unneeded after the form stops using `redux-form-compat`.)
