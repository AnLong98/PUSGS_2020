﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SmartEnergy.Contract.CustomExceptions;
using SmartEnergy.Contract.CustomExceptions.Multimedia;
using SmartEnergy.Contract.CustomExceptions.User;
using SmartEnergy.Contract.DTO;
using SmartEnergy.Contract.Enums;
using SmartEnergy.Contract.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartEnergyAPI.Controllers
{ 
    [Route("api/users")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMultimediaService _multimediaService;

        public UsersController(IUserService userService, IMultimediaService multimediaService)
        {
            _userService = userService;
            _multimediaService = multimediaService;
        }

        [HttpGet("all")]
        [Authorize(Roles = "ADMIN, DISPATCHER")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<UserDto>))]     
        public IActionResult GetAll()
        {
            List<UserDto> users = _userService.GetAll();
            foreach (UserDto u in users) u.StripConfidentialData();
            return Ok(users);

        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UsersListDto))]
        public IActionResult GetAllPaged([FromQuery] string searchParam, [FromQuery] UserField sortBy, [FromQuery] SortingDirection direction,
                                    [FromQuery][BindRequired] int page, [FromQuery][BindRequired] int perPage, [FromQuery] UserStatusFilter status,
                                    [FromQuery] UserTypeFilter type)
        {
            UsersListDto users = _userService.GetUsersPaged(sortBy, direction, page, perPage, status, type, searchParam);
            users.StripConfidentialData();
            return Ok(users);

        }

        [HttpGet("{id}/avatar/{filename}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FileStreamResult))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetFile(int id, string filename)
        {
            try
            {
                return File(_multimediaService.GetUserAvatarStream(id, filename), "application/octet-stream", filename);
            }
            catch (UserNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (MultimediaNotFoundException mne)
            {
                return NotFound(mne.Message);
            }
        }


        [HttpGet("unassigned-crew-members")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<UserDto>))]
        public IActionResult GetUnassignedCrewMembers()
        {
            List<UserDto> users = _userService.GetAllUnassignedCrewMembers();
            foreach (UserDto u in users) u.StripConfidentialData();
            return Ok(users);

        }


        [HttpPut("{id}/approve")]
        [Authorize(Roles ="ADMIN")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult ApproveUser(int id)
        {
            try
            {
                UserDto user = _userService.ApproveUser(id).StripConfidentialData();
                return Ok(user);
            }catch(UserNotFoundException unf)
            {
                return NotFound(unf.Message);
            }
            catch (UserInvalidStatusException ius)
            {
                return BadRequest(ius.Message);
            }

        }


        [HttpPut("{id}/deny")]
        [Authorize(Roles ="ADMIN")]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult DenyUser(int id)
        {
            try
            {
                UserDto user = _userService.DenyUser(id).StripConfidentialData();
                return Ok(user);
            }
            catch (UserNotFoundException unf)
            {
                return NotFound(unf.Message);
            }
            catch (UserInvalidStatusException ius)
            {
                return BadRequest(ius.Message);
            }

        }

        [HttpGet("{id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult GetUserById(int id)
        {
            try
            {
                UserDto user = _userService.Get(id).StripConfidentialData();
                return Ok(user);
            }
            catch (UserNotFoundException unf)
            {
                return NotFound(unf.Message);
            }

        }


        [HttpPost]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(UserDto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult CreateUser([FromBody] UserDto newUser)
        {
            try
            {
                UserDto user = _userService.Insert(newUser).StripConfidentialData();
                return CreatedAtAction(nameof(GetUserById), new { id = user.ID}, user);
            }
            catch (CrewNotFoundException unf)
            {
                return NotFound(unf.Message);
            }
            catch (InvalidUserDataException ius)
            {
                return BadRequest(ius.Message);
            }

        }

        [HttpPost("login")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult Login([FromBody] LoginDto userInfo)
        {
            try
            {
                UserDto userData;
                string tokenString = _userService.Login(userInfo, out userData);
                return Ok(new { Token = tokenString, UserData = userData });
            }
            catch (UserNotFoundException unf)
            {
                return NotFound(unf.Message);
            }
            catch (InvalidUserDataException ius)
            {
                return BadRequest(ius.Message);
            }
            catch (UserInvalidStatusException ius)
            {
                return Unauthorized(ius.Message);
            }

        }


        [HttpPost("google-login")]
        [AllowAnonymous]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> ExternalLogin([FromBody] ExternalLoginDto externalAuth)
        {
            //TODO: Implement google auth in controller
            return Ok(new LoginResponseDto { Token = "", IsSuccessfull = true });
        }

        [HttpPost("{id}/avatar")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [RequestSizeLimit(long.MaxValue)]
        public async Task<IActionResult> AttachAvatarAsync(int id, IFormFile file)
        {
            try
            {
                await _multimediaService.AttachUserAvatar(file, id);
                return Ok();
            }
            catch (UserNotFoundException wnf)
            {
                return NotFound(wnf.Message);
            }
            catch (MultimediaInfectedException mie)
            {
                return BadRequest(mie.Message);
            }
            catch (MultimediaNotImageException mni)
            {
                return BadRequest(mni.Message);
            }
        }


    }
}
