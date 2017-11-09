import React from 'react';
import { connect } from 'react-redux';
import { Fields, reduxForm as reduxForm6 } from 'redux-form';
import { get, set } from 'lodash';

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
export const defaultConfig = {
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
};

export const reduxForm = (
  config,
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options
) => WrappedComponent => {
  return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(
    reduxForm6({ ...defaultConfig, ...config })(
      ReduxFormCompat(config, WrappedComponent)
    )
  );
};
