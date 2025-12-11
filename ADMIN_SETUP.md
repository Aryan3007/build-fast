# Admin Dashboard Configuration

## Setup

To grant admin access to specific email addresses:

1. Add the `ADMIN_EMAILS` environment variable to your `.env` file:

```env
ADMIN_EMAILS=your-email@example.com,another-admin@example.com
```

2. You can add multiple admin emails by separating them with commas.

3. Alternatively, you can manually update users in the database to set `isAdmin: true`:

```sql
UPDATE "User" SET "isAdmin" = true WHERE email = 'your-email@example.com';
```

## Accessing the Admin Dashboard

Once configured, admin users can access the admin dashboard at:

```
http://localhost:3000/admin
```

## Admin Dashboard Features

- **Dashboard**: Overview with statistics (total users, sites, templates, components)
- **Users**: View all users and their admin status
- **Sites**: View all sites created by users
- **Templates**: Browse and manage templates
- **Components**: Browse component library organized by category

## Security

- Admin routes are protected by middleware
- Non-admin users are automatically redirected to the home page
- Admin status is checked on every admin route request
