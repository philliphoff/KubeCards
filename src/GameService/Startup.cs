using GameService.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.AzureADB2C.UI;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace GameService
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<IGameStateProvider>(new GameStateProvider(Configuration));

            services.AddAuthentication(AzureADB2CDefaults.BearerAuthenticationScheme)
                .AddAzureADB2CBearer(options =>
                {
                    options.Instance = this.Configuration["AAD_B2C_Instance"];
                    options.ClientId = this.Configuration["AAD_B2C_ClientId"];
                    options.Domain = this.Configuration["AAD_B2C_Domain"];
                    options.SignUpSignInPolicyId = this.Configuration["AAD_B2C_SignUpSignInPolicyId"];
                });
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseCors(builder =>
                {
                    builder
                        .WithOrigins("http://localhost:3000")
                        .WithHeaders("Authorization");
                });

                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
                app.UseHttpsRedirection();
            }

            app.UseAuthentication();
            app.UseMvc();
        }
    }
}
