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

# Usage

1. Upgrade `redux-form` to the latest version (7.1.2 was tested).
1. Replace `import { reduxForm } from 'redux-form'` with `import { reduxForm } from 'redux-form-compat'`.
1. Follow the other steps in the [migration guide](https://redux-form.com/7.1.2/docs/migrationguide.md/).
    1. `handleSubmit`/`onSubmit` should throw `SubmissionError`.
    1. Convert field arrays to use `FieldArray`.
    1. If normalization is used, those fields will need to be converted to either avoid normalization or use the new normalization.

Undocumented differences found when upgrading from redux-form 5.3.6 to 7.1.2:

 * The synchronous validation function (`validate`) will no loger receive empty
   objects when none of the nested fields have values.
