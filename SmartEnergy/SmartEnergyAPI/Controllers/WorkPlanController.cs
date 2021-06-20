using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SmartEnergy.Contract.CustomExceptions;
using SmartEnergy.Contract.CustomExceptions.Multimedia;
using SmartEnergy.Contract.CustomExceptions.WorkPlan;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Enums;
using SmartEnergy.Contract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartEnergyAPI.Controllers
{
    [Route("api/work-plans")]
    [ApiController]
    public class WorkPlanController : ControllerBase
    {
        private readonly IWorkPlanService _workPlanService;
        private readonly IMultimediaService _multimediaService;
        private readonly IStateChangeService _stateChangeService;
        private readonly IAuthHelperService _authHelperService;
        public WorkPlanController(IWorkPlanService workPlanService, IMultimediaService multimediaService,
            IStateChangeService stateChangeService, IAuthHelperService authHelperService)
        {
            _workPlanService = workPlanService;
            _multimediaService = multimediaService;
            _stateChangeService = stateChangeService;
            _authHelperService = authHelperService;
        }

        [HttpGet("all")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER, WORKER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<WorkPlanDto>))]
        public IActionResult GetAll()
        {
            return Ok(_workPlanService.GetAll());
        }

        [HttpGet]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER, WORKER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<WorkPlanDto>))]
        public IActionResult GetPaged([FromQuery] string searchParam, [FromQuery] WorkPlanField sortBy, [FromQuery] SortingDirection direction,
                                    [FromQuery][BindRequired] int page, [FromQuery][BindRequired] int perPage, [FromQuery] DocumentStatusFilter status,
                                    [FromQuery] OwnerFilter owner)
        {
            return Ok(_workPlanService.GetWorkPlansPaged(sortBy, direction, page, perPage, status, owner, searchParam, User));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER, WORKER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WorkPlanDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetById(int id)
        {
            try
            {
                WorkPlanDto workPlan = _workPlanService.Get(id);
                return Ok(workPlan);
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }

        [HttpGet("{id}/devices")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER, WORKER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<DeviceDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetWorkPlanDevices(int id)
        {
            try
            {
                return Ok(_workPlanService.GetWorkPlanDevices(id));
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }

        [HttpPost]
        [Authorize(Roles = "DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WorkPlanDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CreateWorkPlan([FromBody] WorkPlanDto workPlan)
        {
            try
            {
                WorkPlanDto newWorkPlan = _workPlanService.Insert(workPlan);
                return CreatedAtAction(nameof(GetById), new { id = newWorkPlan.ID }, newWorkPlan);
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (UserNotFoundException unf)
            {
                return NotFound(unf.Message);
            }
            catch (WorkPlanInvalidStateException wris)
            {
                return BadRequest(wris.Message);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WorkPlanDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult EditWorkPlan(int id, [FromBody] WorkPlanDto workPlan)
        {
            try
            {
                WorkPlanDto modified = _workPlanService.Update(workPlan);
                return Ok(modified);
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (UserNotFoundException unf)
            {
                return NotFound(unf.Message);
            }
            catch (WorkPlanInvalidStateException wris)
            {
                return BadRequest(wris.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteWorkPlan(int id)
        {

            try
            {
                _workPlanService.Delete(id);
                return NoContent();
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }

        [HttpPost("{id}/attachments")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> AttachFileAsync(int id, IFormFile file)
        {
            try
            {
                await _multimediaService.AttachFileToWorkPlanAsync(file, id);
                return Ok();
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (MultimediaAlreadyExists mae)
            {
                return BadRequest(mae.Message);
            }
            catch (MultimediaInfectedException mie)
            {
                return BadRequest(mie.Message);
            }
            catch (WorkPlanInvalidStateException wis)
            {
                return BadRequest(wis.Message);
            }
        }

        [HttpGet("{id}/attachments/{filename}")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileStreamResult))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetFile(int id, string filename)
        {
            try
            {
                return File(_multimediaService.GetWorkPlanAttachmentStream(id, filename), "application/octet-stream", filename);
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (MultimediaNotFoundException mne)
            {
                return NotFound(mne.Message);
            }
        }

        [HttpGet("{id}/attachments")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<MultimediaAttachmentDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetWorkPlanAttachments(int id)
        {
            try
            {
                return Ok(_multimediaService.GetWorkPlanAttachments(id));
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }

        [HttpGet("{id}/state-changes")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<StateChangeHistoryDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetWorkPlanStateChanges(int id)
        {
            try
            {
                return Ok(_stateChangeService.GetWorkPlanStateHistory(id));
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }

        [HttpGet("{id}/instructions")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<InstructionDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetInstructions(int id)
        {
            try
            {
                return Ok(_workPlanService.GetInstructions(id));
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }

        [HttpDelete("{id}/attachments/{filename}")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteAttachment(int id, string filename)
        {
            try
            {
                _multimediaService.DeleteWorkPlanAttachment(id, filename);
                return Ok();
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (MultimediaNotFoundException mnf)
            {
                return NotFound(mnf.Message);
            }
            catch (WorkPlanInvalidStateException wis)
            {
                return BadRequest(wis.Message);
            }
        }

        [HttpPut("{id}/approve")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WorkPlanDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ApproveWorkPlan(int id)
        {
            try
            {
                WorkPlanDto wr = _stateChangeService.ApproveWorkPlan(id, User);
                return Ok(wr);
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (WorkPlanInvalidStateException wnf)
            {
                return BadRequest(wnf.Message);
            }
        }

        [HttpPut("{id}/cancel")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WorkPlanDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult CancelWorkPlan(int id)
        {
            try
            {
                WorkPlanDto wr = _stateChangeService.CancelWorkPlan(id, User);
                return Ok(wr);
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (WorkPlanInvalidStateException wnf)
            {
                return BadRequest(wnf.Message);
            }
        }

        [HttpPut("{id}/deny")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(WorkPlanDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult DenyWorkPlan(int id)
        {
            try
            {
                WorkPlanDto wr = _stateChangeService.DenyWorkPlan(id, User);
                return Ok(wr);
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (WorkPlanInvalidStateException wnf)
            {
                return BadRequest(wnf.Message);
            }
        }

        [HttpPut("{wpId}/approve-instruction/{id}")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(InstructionDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult ApproveInstruction(int id)
        {
            try
            {
                InstructionDto wr = _workPlanService.ApproveInstruction(id, User);
                return Ok(wr);
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (WorkPlanInvalidStateException wnf)
            {
                return BadRequest(wnf.Message);
            }
        }

        [HttpDelete("{wpId}/instructions/{id}")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteInstruction(int id)
        {

            try
            {
                _workPlanService.DeleteInstruction(id);
                return NoContent();
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }

        [HttpDelete("{id}/instructions")]
        [Authorize(Roles = "CREW_MEMBER, DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DeleteInstructions(int id)
        {
            try
            {
                _workPlanService.DeleteInstructions(id);
                return NoContent();
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
        }

        [HttpPost("add-instruction")]
        [Authorize(Roles = "DISPATCHER", Policy = "ApprovedOnly")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(InstructionDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public IActionResult AddInstruction([FromBody] InstructionDto instruction)
        {
            try
            {
                InstructionDto newInstruction = _workPlanService.AddInstruction(instruction);
                return Ok();
                //return CreatedAtAction(nameof(GetById), new { id = newInstruction.ID }, newInstruction);
            }
            catch (WorkPlanNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (UserNotFoundException unf)
            {
                return NotFound(unf.Message);
            }
            catch (WorkPlanInvalidStateException wris)
            {
                return BadRequest(wris.Message);
            }
        }
    }
}
