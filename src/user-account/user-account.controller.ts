import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UserAccountService } from './user-account.service';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { Request, Response } from 'express';
import { userDTO } from './dto/userAcc.dto';

@Controller('user-account')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}


  @Post('/register')
  async registerAcc(@Body() registerAccs: any){
    this.userAccountService.registerAcc(registerAccs);
  }

  @Post('/login')
  async loginAcc(@Body() loginAcc: any, @Res({ passthrough: true }) response: Response) {
    const logins = await this.userAccountService.loginAcc(loginAcc);
    if(logins){
      response.cookie('id', logins.id)
      response.cookie('user_rights', logins.user_rights)
      response.cookie('planner', logins.planner)
      response.cookie('converting', logins.converting)
      response.cookie('delivery', logins.delivery)
      response.cookie('edit_orders', logins.edit_orders)
      response.cookie('lineup', logins.lineup)
      response.cookie('fg', logins.fg)
      response.cookie('returns', logins.returns)
      response.cookie('status_page', logins.status_page)
      response.cookie('useracc', logins.useracc)
      response.cookie('import_orders', logins.import_orders)
      return logins
    }
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) response: Response){
      response.clearCookie('id')
      response.clearCookie('user_rights')
      response.clearCookie('planner')
      response.clearCookie('converting')
      response.clearCookie('delivery')
      response.clearCookie('edit_orders')
      response.clearCookie('lineup')
      response.clearCookie('fg')
      response.clearCookie('returns')
      response.clearCookie('status_page')
      response.clearCookie('useracc')
      response.clearCookie('import_orders')
  }
  @Patch('/updateUsers/:id')
  update(@Param('id') id: string, @Body() useracc: userDTO, response: Response) {
    // this.loginAcc(useracc, response)
    return this.userAccountService.update(+id, useracc);
  }

  @Get('/findUser/:id')
  async getUsers(@Param('id') id: number, @Res({ passthrough: true }) response: Response){
    const user = await this.userAccountService.findOne(id);
    if(user){
      response.cookie('id', user.id)
      response.cookie('user_rights', user.user_rights)
      response.cookie('planner', user.planner)
      response.cookie('converting', user.converting)
      response.cookie('delivery', user.delivery)
      response.cookie('edit_orders', user.edit_orders)
      response.cookie('lineup', user.lineup)
      response.cookie('fg', user.fg)
      response.cookie('returns', user.returns)
      response.cookie('status_page', user.status_page)
      response.cookie('useracc', user.useracc)
      response.cookie('import_orders', user.import_orders)
    }
  }

  @Get('/getAllUsers')
  async getAllUsers(){
    return await this.findAll()
  }

  @Post()
  create(@Body() createUserAccountDto: CreateUserAccountDto) {
    return this.userAccountService.create(createUserAccountDto);
  }

  @Get()
  findAll() {
    return this.userAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userAccountService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userAccountService.remove(+id);
  }
}
