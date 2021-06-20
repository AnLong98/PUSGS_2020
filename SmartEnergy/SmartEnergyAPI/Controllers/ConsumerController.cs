using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SmartEnergy.Contract.CustomExceptions.Consumer;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Enums;
using SmartEnergy.Contract.Interfaces;

namespace SmartEnergyAPI.Controllers
{
    [Route("api/consumers")]
    [ApiController]
    public class ConsumerController : ControllerBase
    {
        private readonly IConsumerService _consumerService;

        public ConsumerController(IConsumerService consumerService)
        {
            _consumerService = consumerService;
        }

        [HttpGet("all")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ConsumerDto>))]
        public IActionResult GetConsumers()
        {
            return Ok(_consumerService.GetAll());

        }
        
        [HttpGet]
        //[Authorize(Roles = "ADMIN", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<ConsumerDto>))]
        public IActionResult GetPaged([FromQuery] string searchParam, [FromQuery] ConsumerField sortBy, [FromQuery] SortingDirection direction,
                                    [FromQuery][BindRequired] int page, [FromQuery][BindRequired] int perPage, [FromQuery] AccountTypeFilter type)
        {
            return Ok(_consumerService.GetConsumersPaged(sortBy, direction, page, perPage, type, searchParam));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ConsumerDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetById(int id)
        {
            try
            {
                ConsumerDto consumer = _consumerService.Get(id);
                return Ok(consumer);
            }
            catch (ConsumerNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }
        /*
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ConsumerDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateConsumer([FromBody] ConsumerDto consumer)
        {
            try
            {
                ConsumerDto cons = _consumerService.Insert(consumer);
                return CreatedAtAction(nameof(GetById), new { id = cons.ID }, cons);
            }
            catch (InvalidConsumerException wris)
            {
                return BadRequest(wris.Message);
            }
        }
        */
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ConsumerDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult EditConsumer([FromBody] ConsumerDto consumer)
        {
            try
            {
                ConsumerDto modified = _consumerService.Update(consumer);
                return Ok(modified);
            }
            catch (InvalidConsumerException wris)
            {
                return BadRequest(wris.Message);
            }
        }
       
        
        [HttpGet("add")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ConsumerDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateConsumer([FromQuery] string name, [FromQuery] string lastname, [FromQuery][BindRequired] int locationID,
            [FromQuery] string accountID, [FromQuery] string phone, [FromQuery] string accountType)
        {
            try
            {
                _consumerService.Insert(name, lastname, locationID, accountID, accountType, phone);
                return Ok(true);
            }
            catch (InvalidConsumerException wris)
            {
                return BadRequest(wris.Message);
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteConsumer(int id)
        {

            try
            {
                _consumerService.Delete(id);
                return NoContent();
            }
            catch (InvalidConsumerException wnf)
            {
                return NotFound(wnf.Message);
            }
        }
    }
}
