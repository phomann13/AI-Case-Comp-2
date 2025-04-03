-- CreateTable
CREATE TABLE "Issue" (
    "Summary" TEXT,
    "Issue key" TEXT NOT NULL,
    "Issue id" INTEGER NOT NULL,
    "Issue Type" TEXT NOT NULL,
    "Status" TEXT NOT NULL,
    "Project key" TEXT NOT NULL,
    "Project name" TEXT NOT NULL,
    "Priority" TEXT,
    "Resolution" TEXT,
    "Assignee" TEXT,
    "Reporter (Email)" TEXT,
    "Creator (Email)" TEXT,
    "Created" TIMESTAMP(3) NOT NULL,
    "Updated" TIMESTAMP(3) NOT NULL,
    "Last Viewed" TIMESTAMP(3),
    "Resolved" TIMESTAMP(3),
    "Due date" TIMESTAMP(3),
    "Description" TEXT,
    "Partner Names" TEXT,
    "Custom field (Cause of issue)" TEXT,
    "Custom field (Record/Transaction ID)" TEXT,
    "Custom field (Region)" TEXT,
    "Custom field (Relevant Departments)" TEXT,
    "Custom field (Relevant Departments).1" TEXT,
    "Custom field (Request Category)" TEXT,
    "Custom field (Request Type)" TEXT,
    "Custom field (Request language)" TEXT,
    "Custom field (Resolution Action)" TEXT,
    "Satisfaction rating" INTEGER,
    "Custom field (Satisfaction date)" TIMESTAMP(3),
    "Custom field (Source)" TEXT,
    "Custom field (Time to first response)" INTEGER,
    "Custom field (Time to resolution)" INTEGER,
    "Custom field (Work category)" TEXT,
    "Status Category" TEXT,
    "Status Category Changed" TIMESTAMP(3),
    "Custom field ([CHART] Date of First Response)" INTEGER,
    "comments" TEXT[],
    "Category" TEXT,
    "Subcategory" TEXT,
    "Last message" TEXT,
    "Priority score" DOUBLE PRECISION,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("Issue id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Issue_Issue key_key" ON "Issue"("Issue key");

-- CreateIndex
CREATE UNIQUE INDEX "Issue_Issue id_key" ON "Issue"("Issue id");
