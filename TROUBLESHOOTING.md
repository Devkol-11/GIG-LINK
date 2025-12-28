# Troubleshooting

## Server Won't Start

### Port 3000 Already in Use

```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error

```
Error: connect ECONNREFUSED

Solution:
1. Ensure DATABASE_URL is correct in .env
2. PostgreSQL service is running
3. Database exists and is accessible
```

## TypeScript Errors

### Check for errors before running

```bash
npm run type check
```

### Common issues:

- Missing type definitions: `npm install --save-dev @types/package-name`
- Check file paths and imports are correct
- Ensure environment types in `types/express.d.ts`

## Database Issues

### Reset database

```bash
npm run db:reset
```

### Create new migration

```bash
npm run db:migrate
```

### View database

```bash
npx prisma studio
```

## Authentication Issues

### "Invalid Token" Error

- Token expired: Login again to get new token
- Token format wrong: Ensure `Authorization: Bearer <token>`
- JWT_SECRET mismatch: Check `.env` JWT_SECRET matches what was used to generate token

### Cannot Register

- Email already exists
- Password too weak (must have uppercase, numbers, special chars)
- Invalid email format

## Email Not Sending

### OTP/Welcome Email Not Received

1. Check EMAIL_USER and EMAIL_PASS in `.env`
2. Gmail: Use App Password (not regular password)
3. Outlook: Enable "Less Secure Apps"
4. Check spam/junk folder
5. Check logs: `tail -f logs/error.log`

## Payment Issues

### Paystack Payment Failing

- Verify PAYSTACK_API_KEY in `.env` is correct
- Check amount is in kobo (multiply by 100)
- Email must be valid
- Network issues: Try again

### Webhook Not Working

- Ensure FRONTEND_URL in `.env` is correct
- Check server is publicly accessible
- Verify webhook secret in Paystack dashboard

## Testing Issues

### Tests Failing

```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

## Performance

### Slow API Responses

1. Check database query performance
2. Monitor Redis connection: `PING` via redis-cli
3. Check Node logs for blocking operations
4. Analyze query in Prisma Studio

### High Memory Usage

- Check for memory leaks in jobs (BullMQ)
- Restart server: `npm run dev`
- Monitor with: `node --inspect src/server.ts`

## Environment Variables

### Missing .env file

```bash
cp .env.example .env
# Edit .env with your values
```

### Required variables:

```
DATABASE_URL        - PostgreSQL connection string
JWT_SECRET          - Secret key for JWT tokens
REDIS_URL           - Redis connection
EMAIL_USER          - Email for sending
EMAIL_PASS          - Email password/app password
PAYSTACK_API_KEY    - Paystack API key
FRONTEND_URL        - Frontend domain for links
```

## Still Stuck?

1. Check error logs: `logs/error.log`
2. Enable debug: `DEBUG=* npm run dev`
3. Check request/response in Swagger UI: `http://localhost:3000/api-docs`
4. Verify endpoints exist: Check `src/contexts/*/http/` folders
