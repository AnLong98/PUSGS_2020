using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartEnergy.Contract.CustomExceptions.Location;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartEnergyAPI.Controllers
{
    [Route("api/locations")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public LocationController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<LocationDto>))]
        public IActionResult GetAll()
        {
            return Ok(_locationService.GetAllLocations());
        }
        
        [HttpPost("streets-priorities")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<LocationDto>))]
        public IActionResult ChangePriorities(List<LocationDto> locations)
        {
            try
            {
                _locationService.ChangePriorities(locations);
                return Ok(true);
            }
            catch(InvalidLocationException e)
            {
                return BadRequest(e.Message);
            }
        }
        
    }
}
