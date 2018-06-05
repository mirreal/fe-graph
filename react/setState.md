# setState

State Updates May Be Asynchronous

```javascript
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

仍然是错误的：

```javascript
// Wrong
const { counter } = this.state;
const { increment } = this.props;

this.setState({
  counter: counter + increment,
});
```

正确的用法：

```javascript
// Correct
this.setState((prevState, props) => ({
  counter: prevState.counter + props.increment
}));
```