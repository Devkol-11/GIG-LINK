import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'GIG-LINK Platform API',
			version: '1.0.0',
			description: `
# GIG-LINK Platform API Documentation

Complete REST API for the GIG-LINK platform. Includes:
- **Authentication** - User registration, login, password management
- **User Management** - Profile creation and updates
- **Marketplace** - Gigs, applications, and contracts
- **Billing** - Payments, withdrawals, wallets, and escrow management

## Quick Start
1. Register as a Freelancer or Creator at \`/auth/register/*\`
2. Login at \`/auth/login\` to get JWT token
3. Use the token in the Authorization header: \`Bearer <your_token>\`
4. Access authenticated endpoints with your role permissions

## Roles
- **FREELANCER** - Can apply for gigs, view contracts
- **CREATOR** - Can create gigs, hire freelancers, manage escrow
- **ADMIN** - Full system access (future)
			`,
			contact: {
				name: 'GIG-LINK Support',
				email: 'support@gig-link.com'
			}
		},

		servers: [
			{
				url: 'http://localhost:3000/api',
				description: 'Development Server'
			},
			{
				url: '/api',
				description: 'API Root'
			}
		],

		components: {
			securitySchemes: {
				BearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'JWT token obtained from login endpoint'
				}
			},

			schemas: {
				Error: {
					type: 'object',
					properties: {
						message: { type: 'string' },
						statusCode: { type: 'number' },
						error: { type: 'string' }
					}
				},
				User: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						email: { type: 'string', format: 'email' },
						firstName: { type: 'string' },
						lastName: { type: 'string' },
						role: { type: 'string', enum: ['FREELANCER', 'CREATOR'] },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' }
					}
				},
				AuthTokens: {
					type: 'object',
					properties: {
						accessToken: { type: 'string' },
						refreshToken: { type: 'string' }
					}
				},
				Gig: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						title: { type: 'string' },
						description: { type: 'string' },
						price: { type: 'number' },
						category: { type: 'string' },
						creatorId: { type: 'string' },
						status: { type: 'string', enum: ['ACTIVE', 'INACTIVE', 'COMPLETED'] },
						createdAt: { type: 'string', format: 'date-time' }
					}
				},
				Payment: {
					type: 'object',
					properties: {
						id: { type: 'string' },
						userId: { type: 'string' },
						amount: { type: 'number' },
						status: { type: 'string', enum: ['PENDING', 'SUCCESS', 'FAILED'] },
						reference: { type: 'string' },
						createdAt: { type: 'string', format: 'date-time' }
					}
				}
			},

			responses: {
				Unauthorized: {
					description: 'Unauthorized - Missing or invalid JWT token',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Error' }
						}
					}
				},
				Forbidden: {
					description: 'Forbidden - Insufficient permissions for this resource',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Error' }
						}
					}
				},
				NotFound: {
					description: 'Resource not found',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Error' }
						}
					}
				},
				BadRequest: {
					description: 'Bad Request - Invalid parameters',
					content: {
						'application/json': {
							schema: { $ref: '#/components/schemas/Error' }
						}
					}
				}
			}
		},

		security: [
			{
				BearerAuth: []
			}
		]
	},

	apis: ['src/contexts/**/http/routes/**/*.ts']
});
