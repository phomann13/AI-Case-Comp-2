import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getSources() {
  const response = await prisma.issue.findMany(
    {
      select: {
        source: true,
      },
    }
  );
//   console.log(response.unique({ by: 'source' }));
  const sources = {
    "Email to Jira": Number(response.filter(item => item.source === 'Email to Jira').length),
    "Portal": Number(response.filter(item => item.source === 'Portal').length),
    "Phone": Number(response.filter(item => item.source === 'Phone').length),
    "Forwarded by Staff (Phone or Email)": Number(response.filter(item => item.source === 'Forwarded by Staff (Phone or Email)').length),
    "Other": Number(response.filter(item => item.source !== 'Email to Jira' && item.source !== 'Portal' && item.source !== 'Phone' && item.source !== 'Forwarded by Staff (Phone or Email)').length),
  }
//   console.log(sources["Email to Jira"]);
  return sources;
}

export async function getStatuses() {
  const response = await prisma.issue.findMany(
    {
      select: {
        status: true,
      },
    }
  );
  const statuses = {
    "Open": Number(response.filter(item => item.status === 'Open').length),
    "In Progress": Number(response.filter(item => item.status === 'In Progress').length),
    "Closed": Number(response.filter(item => item.status === 'Closed').length),
  }
  return statuses;
}

export async function getTickets() {
  const response = await prisma.issue.findMany(
    {
      select: {
        created: true,
      },
    }
  );
  const tickets = {
    "2025": response.filter(item => item.created.getFullYear() === 2025),
    "2024": response.filter(item => item.created.getFullYear() === 2024),
    "2023": response.filter(item => item.created.getFullYear() === 2023),
    "2022": response.filter(item => item.created.getFullYear() === 2022),
    "2021": response.filter(item => item.created.getFullYear() === 2021),
    "2020": response.filter(item => item.created.getFullYear() === 2020),
  }
//   console.log(tickets);
  return tickets;
}
export async function inProgressTickets() {
    
  const response = await prisma.issue.findMany(
    {
      select: {
        lastMessage: true,
      },
      where: {
        status: 'In Progress',
      },
    }
  );
  const inProgressTickets = {
    "Client": Number(response.filter(item => item.lastMessage === 'Client').length),
    "Agent": Number(response.filter(item => item.lastMessage === 'Agent').length),
  }
  return inProgressTickets;
}

export async function getTicketsByPriority() {
  const response = await prisma.issue.findMany(
    {
    where: {OR: [
      {status: 'Open'},
      {status: 'In Progress'},
    ]},
    orderBy: {
      priorityScore: 'desc',
    },
    take: 15,
    },
  );
  return response;
}

export async function getIssueIds() {
  const response = await prisma.issue.findMany(
    {
      select: {
        issueId: true,
      },
     
    }
    
  );
  const issueIds = response.map(item => item.issueId).sort(() => Math.random() - 0.5);
  return issueIds;
}

export async function getAllTickets(){
  const response = await prisma.issue.findMany({});
  
  // console.log(response);
  return response;
}


//Group bys

export async function getTicketsByAssigned() {
  const response = await prisma.issue.groupBy({
    by: ['assignee'],
    _count: {
      _all: true,
    },
    
  });
  return response;
}