import { domainEventBus } from '@src/contexts/Billings/adapters/Domain-EventBus.js';
import { EscrowAccount } from '@src/contexts/Billings/domain/entities/Escrow.js';
import { escrowAccountRepository } from '@src/contexts/Billings/adapters/EscrowAccountRepository.js';
import { EscrowAccountCreated } from '@src/contexts/Billings/domain/events/escrow.account.created.js';

interface payload {
        contractId: string;
        creatorId: string;
        freelancerId: string;
        contractAmount: number;
}

export function escrow_create_account_handler() {
        domainEventBus.subscribe('contract:created', async (payload: payload) => {
                const { contractId, creatorId, freelancerId, contractAmount } = payload;

                const escrowAccount = EscrowAccount.Create({
                        contractId,
                        creatorId,
                        freelancerId,
                        balanceKobo: 0,
                        expectedAmountKobo: contractAmount
                });

                const newEscrowAccount = await escrowAccountRepository.save(escrowAccount);

                const eventPayload = new EscrowAccountCreated(
                        newEscrowAccount.id,
                        newEscrowAccount.creatorId,
                        newEscrowAccount.balance
                );

                domainEventBus.publish(eventPayload.eventName, eventPayload.getEventPayload());
        });
}
