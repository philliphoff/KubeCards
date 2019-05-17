CREATE TABLE [dbo].[UserCards] (
    [UserId] NVARCHAR (50) NOT NULL,
    [CardId] NVARCHAR (50) NOT NULL,
    [CardValue] INT NOT NULL,
    [CreatedDateTimeUtc] DATETIME NOT NULL,
    CONSTRAINT PK_UserCards PRIMARY KEY CLUSTERED ([CardId] ASC, [UserId] ASC)
);
