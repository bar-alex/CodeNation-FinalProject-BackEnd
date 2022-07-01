# Documenting the workflow

- Decided to use bcrypt in the model rules, rather than middleware, before saving the password and provide a compare pass method to the model because, in the end, these belong to the model
- 

- bcrypt can be uses in a pre hook