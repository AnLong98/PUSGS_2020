using Dapr.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SmartEnergyAPI.Controllers
{
    [Route("api/locations")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;
        private readonly DaprClient _dapr;

        public LocationController(ILocationService locationService, DaprClient dapr)
        {
            _locationService = locationService;
            _dapr = dapr;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<LocationDto>))]
        public async Task<IActionResult> GetAllAsync()
        {
            var nesto = await _dapr.InvokeMethodAsync<IEnumerable<CrewDto>>(HttpMethod.Get, "smartenergyusers", "/api/crews/all" );
            return Ok(_locationService.GetAllLocations());
        }

    }
}
