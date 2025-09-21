using CRMReact.Data;
using CRMReact.DTOs.Interfaces;
using CRMReact.Server.Handlers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;

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
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/User/Login";
        options.LogoutPath = "/User/Logout";
        options.ExpireTimeSpan = TimeSpan.FromHours(24);
    });

var app = builder.Build();

app.MapDefaultEndpoints();
app.UseDefaultFiles();
app.UseRouting();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<CRMContext>();
            context.Database.Migrate();
            Console.WriteLine("Migrations applied successfully.");
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while migrating the database.");
            throw;
        }
    }
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
