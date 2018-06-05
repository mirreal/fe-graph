# 函数重载

```js
// addMethod - By John Resig (MIT Licensed)
function addMethod(object, name, fn) {
  var old = object[name]

  object[name] = function() {
    if (fn.length === arguments.length) return fn.apply(this, arguments)
    else if (typeof old === 'function') return old.apply(this, arguments)
  }
}

function Users() {
  addMethod(Users.prototype, 'find', function() {
    console.log('Find all users...')
  })
  addMethod(Users.prototype, 'find', function(name) {
    console.log('Find a user by name')
  })
  addMethod(Users.prototype, 'find', function(first, last) {
    console.log('Find a user by first and last name')
  })
}

var users = new Users()
users.find() // Finds all
users.find('John') // Finds users by name
users.find('John', 'Resig') // Finds users by first and last name
users.find('John', 'E', 'Resig') // Does nothing
```
