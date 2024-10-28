using CRMReact.Data;
using CRMReact.DTOs.Interfaces;
using CRMReact.Server.Handlers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddProblemDetails();

builder.Services.AddDbContext<CRMContext>(x =>
{
    x.UseSqlite("Data Source=database/database.db");
});
builder.Services.AddAutoMapper([typeof(IDTO).Assembly]);
builder.Services.AddExceptionHandler<DomainValidationExceptionHandler>();
DataServices.AddDataServices(builder.Services);
var app = builder.Build();

app.MapDefaultEndpoints();
app.UseDefaultFiles();
app.UseRouting();
app.UseStaticFiles();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseExceptionHandler();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
