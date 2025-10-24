module.exports = ({ env }) => ({
  "users-permissions": {
    config: {
      register: {
        allowedFields: ["password"], // здесь перечислите нужные поля
      },
    },
  },
});