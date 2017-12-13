# Eventful

This is a small library that adds the ability to listen to events and dispatch
events from Javascript objects.

## Examples

### Example #1 (Constructor function with `new` keyword)
```js
// Constructor function
function Cat() {
  this.legs = 4;

  // The following line is very important
  Eventful.apply(this);
};

// This line is also very important.
Cat.prototype = EventfulPrototype();

Cat.prototype.speak = function() {
  if (!this.meowCount) {
    this.meowCount = 0;
  }

  // The cat prototype now has the ability to fire events
  this.fireEvent('meow', {
    count: ++this.meowCount
  });
};

// Create an instance
let tabby = new Cat();

// Register an event listener
// e.detail allows us to access any data that is passed to the event
tabby.on('meow', function(e) {
  console.log('The cat says meow', e.detail.count);
});

// Register a single use event listener
tabby.once('meow', function(e) {
  console.log('This will only trigger once');
});

tabby.speak();
// The cat says meow 1
// 'This will only trigger once'
tabby.speak();
// The cat says meow 2

// Remove all 'meow' listeners
tabby.off('meow');
tabby.speak();
//
```
### Example #2 (Object literal)
```js
let me = {
 name: 'James'
};

Object.setPrototypeOf(me, Eventful.prototype);
Eventful.apply(me);

me.on('greet', () => console.log('hello'));
me.fireEvent('greet');
// hello
```
### Example #3 (Object literal with helper function)
```js
let me = {
 name: 'James'
};

me = Eventify(me);

me.on('greet', () => console.log('hello'));
me.fireEvent('greet');
// hello
```

### Example #4 (Object.create)
```js
// Making an Eventful object is as easy as this:
let dog = Object.create(new Eventful);

dog.bark = () => console.log('woof');

dog.on('see-cat', dog.bark.bind(dog));
dog.fireEvent('see-cat');
// woof
```