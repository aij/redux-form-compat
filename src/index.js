// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Fields, reduxForm as reduxForm6 } from 'redux-form';
import { get, set } from 'lodash';

import type { ComponentType } from 'react';
import type { Config } from 'redux-form/lib/createReduxForm';

export type CompatConfig = Config & { fields: {} };

const FormWrapper = ({ extraProps, fieldNames, WrappedComponent, ...rest }) => {
  const fields = {};
  fieldNames.forEach(n => {
    const { input, meta } = get(rest, n, {});
    set(fields, n, { ...input, ...meta });
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
        props={{ extraProps: props, fieldNames, WrappedComponent }}
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
};

export const reduxForm = (
  config: CompatConfig,
  mapStateToProps?: mixed => mixed,
  mapDispatchToProps?: mixed => mixed,
  mergeProps?: mixed => mixed,
  options?: mixed
) => (WrappedComponent: ComponentType<*>) => {
  return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(
    reduxForm6({ ...defaultConfig, ...config })(
      ReduxFormCompat(config, WrappedComponent)
    )
  );
};
