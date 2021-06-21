using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SmartEnergy.Contract.CustomExceptions.WorkPlan;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartEnergyAPI.Controllers
{
    [Route("api/notifications")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("all")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER, WORKER, ADMIN", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<NotificationDto>))]
        public IActionResult GetAllNotifications()
        {
            return Ok(_notificationService.GetAll());

        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteAll()
        {

            try
            {
                _notificationService.DeleteAll();
                return NoContent();
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }

    }
}
