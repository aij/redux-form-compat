// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Fields, reduxForm as reduxForm6 } from 'redux-form';
import { get, set } from 'lodash';

import type { ComponentType } from 'react';
import type { Config } from 'redux-form/lib/createReduxForm';

type FieldPropStyle =
  | 'v5' // active, autoFill, autoFilled?, checked?, dirty, error?, initialValue, etc.
  | 'v6' // input, meta
  | 'v5v6'; // all of the above

export type CompatConfig = Config & {
  fields: {},
  fieldPropStyle?: FieldPropStyle,
};

// From https://github.com/erikras/redux-form/blob/v5.3.6/src/isChecked.js
const isChecked = value => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true') {
      return true;
    }
    if (lower === 'false') {
      return false;
    }
  }
  return undefined;
};

const FormWrapper = ({
  extraProps,
  fieldNames,
  fieldPropStyle,
  WrappedComponent,
  ...rest
}) => {
  const fields = {};
  fieldNames.forEach(n => {
    const fprops = get(rest, n, { input: {} });
    const v5props = fieldPropStyle.startsWith('v5')
      ? {
          ...fprops.input,
          ...fprops.meta,
          // Workaround for https://github.com/erikras/redux-form/issues/2512
          checked: isChecked(fprops.input.value),
        }
      : undefined;
    const v6props = fieldPropStyle.endsWith('v6') ? fprops : undefined;
    set(fields, n, { ...v5props, ...v6props });
  });
  return <WrappedComponent {...{ ...rest, ...extraProps }} fields={fields} />;
};

const ReduxFormCompat = (config, WrappedComponent) => {
  const c = props => {
    const fieldNames = props.fields || config.fields;
    return (
      <Fields
        names={fieldNames}
        component={FormWrapper}
        props={{
          extraProps: props,
          fieldNames,
          fieldPropStyle: config.fieldPropStyle,
          WrappedComponent,
        }}
      />
    );
  };
  c.displayName = 'ReduxFormCompat';
  return c;
};

// Default config options to more closely match v5.
export const defaultConfig: Config = {
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  fieldPropStyle: 'v5',
};

export const reduxForm = (
  config: CompatConfig,
  mapStateToProps?: mixed => mixed,
  mapDispatchToProps?: mixed => mixed,
  mergeProps?: mixed => mixed,
  options?: mixed
) => (WrappedComponent: ComponentType<*>) => {
  const mconfig = { ...defaultConfig, ...config };
  return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(
    reduxForm6(mconfig)(ReduxFormCompat(mconfig, WrappedComponent))
  );
};
