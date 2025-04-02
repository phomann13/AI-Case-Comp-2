import { PrismaClient} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Define the structure of an IT ticket
interface ITTicket {
    issueId: number;
    summary: string;
    issueKey: string;
    projectName: string;
    priority: string;
    causeOfIssue: string;
    satisfactionRating: number;
    status: string;
    lastMessage: string;
    created: Date;
    updated: Date;
    requestType: string;
    description: string;
    region: string;
    issueType: string;
    projectKey: string;
    comments: string[];
    priorityScore: number;
    reporterEmail: string;
}
async function main() {
    let ticketNumber = 10000;
    // const prisma = new PrismaClient();
    function generateTicket(): ITTicket {
        ticketNumber++;
        return {
            summary: faker.hacker.phrase(),
            issueId: ticketNumber,
            issueType: '[System] Service request',
            projectKey: 'PART1',
            issueKey: `TICKET-${ticketNumber}`,
            projectName: faker.commerce.department(),
            priority: faker.helpers.arrayElement(['Low', 'Medium', 'High', 'Critical']),
            causeOfIssue: faker.helpers.arrayElement(['Request of Customer Relations', 'Other', 'Partner Error',
                'Partner Knowledge/Training', 'Menu Discrepancy', 'Ops Issue',
                'System Error']),
            satisfactionRating: faker.number.int({ min: 1, max: 5 }),
            status: faker.helpers.arrayElement(['Open', 'Closed', 'In Progress']),
            lastMessage: faker.helpers.arrayElement(['Client', 'Agent']),
            created: faker.date.recent(),
            updated: faker.date.recent(),
            requestType: faker.helpers.arrayElement(['General Questions', 'Email Request', 'Pickup & Delivery Support',
                'Request New Shopper Access', 'Revise My Order',
                'Website Assistance (PartnerLink)', 'Request Produce', 'Grant Support',
                'Billing Support', 'Provide Menu Feedback', 'Request a Return or Refund',
                'Questions about Shopping Menu Items',
                'Provide Operations/Transportation Feedback']),
            description: faker.lorem.paragraph(),
            region: faker.helpers.arrayElement(['DC', 'MD', 'VA']),
            comments:[],
            priorityScore: Math.random(),
            reporterEmail: faker.internet.email(),
        };
    }
    
    // Generate multiple tickets
    function generateTickets(count: number): ITTicket[] {
        return Array.from({ length: count }, generateTicket);
    }
    const tickets = generateTickets(1000);
    console.log(tickets);
   for (const ticket of tickets) {
    await prisma.issue.create({
        data: ticket,
    });
   }
}   

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });