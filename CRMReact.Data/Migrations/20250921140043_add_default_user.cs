using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRMReact.Server.Migrations
{
    /// <inheritdoc />
    public partial class add_default_user : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("Users", ["Id", "Name", "Email", "Password"], [Guid.NewGuid(), "admin", "admin@crm.com", "admin"]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
