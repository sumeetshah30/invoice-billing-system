using InvoiceBillingSystem.API.Data;
using InvoiceBillingSystem.API.DTOs;
using InvoiceBillingSystem.API.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvoiceBillingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _ctx;
    private readonly JwtHelper _jwt;

    public AuthController(AppDbContext ctx, JwtHelper jwt)
    { _ctx = ctx; _jwt = jwt; }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _ctx.Users.FirstOrDefaultAsync(u => u.Email == dto.Email && u.IsActive);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password" });

        return Ok(new AuthResponseDto
        {
            Token = _jwt.GenerateToken(user),
            Name = user.Name, Email = user.Email,
            Role = user.Role.ToString(),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
    }
}
