import React from 'react';
import { render } from 'react-dom';
import Most, { connect } from '../../../lib/react-most'
import {from, lensProp, over, set, identity} from 'ramda'
import Type from 'union-type'
const Intent = Type({
  Inc: [Number],
  Dec: [Number],
  Double: [],
  Half: []
})

const CounterView = props => (
  <div>
    <button onClick={()=>props.actions.half()}>/2</button>
    <button onClick={()=>props.actions.dec(1)}>-1</button>
    <span>{props.count}</span>
    <button onClick={()=>props.actions.inc(1)}>+1</button>
    <button onClick={()=>props.actions.double()}>*2</button>
  </div>
)

CounterView.defaultProps = { count: 0 };

const lensCount = lensProp('count')

const doublable = connect(intent$ => {
  return {
    sink$: intent$.map(Intent.case({
      Double: () => over(lensCount, x=>x*2),
      Half: () => over(lensCount, x=>x/2),
      _: () => identity
    })),
    actions: {
      double: Intent.Double,
      half: Intent.Half,
    }
  }
})

const increasable = connect(intent$ => {
  return {
    sink$: intent$.map(Intent.case({
      Inc: (v) => over(lensCount, x=>x+v),
      Dec: (v) => over(lensCount, x=>x-v),
      _: () => identity
    })),
    actions: {
      inc: Intent.Inc,
      dec: Intent.Dec,
    }
  }
})

const Counter = doublable(increasable(CounterView))

render(
  <Most>
    <Counter />
  </Most>
  , document.getElementById('app'));
