import React from 'react';
import { connect } from 'react-redux';
import { Fields, reduxForm as reduxForm6 } from 'redux-form';
import { fromPairs, get } from 'lodash';

const FormWrapper = ({ extraProps, fieldNames, WrappedComponent, ...rest }) => {
  const fieldPairs = fieldNames.map(n => {
    const { input, meta } = get(rest, n);
    return [n, { ...input, ...meta }];
  });
  const fields = fromPairs(fieldPairs);
  return <WrappedComponent {...{ ...rest, ...extraProps }} fields={fields}/>;
};

const ReduxFormCompat = (config, WrappedComponent) => props => {
  const fieldNames = props.fields || config.fields;
  return <Fields
    names={fieldNames}
    component={FormWrapper}
    props={{ extraProps: props, fieldNames, WrappedComponent }}
    />;
};


export const reduxForm = (config, mapStateToProps, mapDispatchToProps, mergeProps, options) => WrappedComponent => {
  return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(
    reduxForm6(config)(ReduxFormCompat(config, WrappedComponent))
  );
};
