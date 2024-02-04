/* eslint-disable no-sequences */
/* eslint-disable no-return-assign */
export const zipObject = (props: any[], values: any[]) =>
  props.reduce(
    (obj, prop, index) => (
      (obj[prop] = values[index] ? values[index] : null), obj
    ),
    {},
  );
