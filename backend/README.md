## Parameters

### Required:

- `email` - using for assigning task to a user.

> `name` - can be calculated from `email` parameter.

### Optional:

- `due_on` - using for setting due date for a task.

### Link parameters

For example your have a `{{url}}` parameter in template task.
When you passing `url` parameter value for specific task hyperlink will be hidden
under the `url` parameter name.

Example:

```text
Hello, from {{url}}.
```

When you passing `url` parameter with value `https://github.com` for specific task.

It will be rendered as:

```text
Hello, from url.
```

`url` will be clickable and will redirect to `https://github.com`.