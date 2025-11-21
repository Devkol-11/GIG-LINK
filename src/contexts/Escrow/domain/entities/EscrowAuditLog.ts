import { randomUUID } from 'crypto';

interface EscrowAuditLogProps {
        readonly id: string;
        readonly escrowId: string;
        readonly action: string;
        readonly actorId?: string;
        readonly oldState?: Record<string, any>;
        readonly newState?: Record<string, any>;
        readonly createdAt: Date;
}

export class EscrowAuditLog {
        private constructor(private props: EscrowAuditLogProps) {}

        public static create(
                props: Omit<EscrowAuditLogProps, 'id' | 'createdAt'>
        ): EscrowAuditLog {
                return new EscrowAuditLog({
                        id: randomUUID(),
                        createdAt: new Date(),
                        ...props
                });
        }

        getState() {
                return { ...this.props };
        }
}
