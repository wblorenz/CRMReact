var builder = DistributedApplication.CreateBuilder(args);

builder.AddProject<Projects.CRMReact_Server>("crmreact-server");

builder.Build().Run();
