# &lt;countdown-timer&gt;

A web component that displays a countdown timer.

## Properties

`totaltime` - Number determining how long the timer should run for. Measured in milliseconds.

`stopped` - Is the timer stopped?

`timeleft` - How long until the timer reaches zero. Measured in milliseconds.

## Attributes

`totaltime` - Number determining how long the timer should run for. Measured in milliseconds.

`stopped` - Is the timer stopped?

## Events

`timeout` - Fired when the timer reaches 0.

## Example

```html
<countdown-timer time="10000" stopped></countdown-timer>
```
