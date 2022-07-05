import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { userDTO } from './dto/userAcc.dto';
import { UserAccount } from './entities/user-account.entity';

@Injectable()
export class UserAccountService {

  constructor(
    @InjectRepository(UserAccount)
    private readonly accounts: Repository<UserAccount>
    ){

  }

  registerAcc(data: any){
    this.accounts.save(data);
  }

  async loginAcc(data: any){
    const user = await this.accounts.createQueryBuilder().
    where('username = :user AND password = :pass',{
      user:data.username,
      pass:data.password
    }).getOne()
    if(user){
      return user
    }
  }

  create(createUserAccountDto: CreateUserAccountDto) {
    return 'This action adds a new userAccount';
  }

  findAll() {
    return this.accounts.find();
  }

  findOne(id: any) {
    return this.accounts.createQueryBuilder().
    where('id = :id',{
      id: id
    }).getOne()
    
  }

  update(id: number, updateAcc: userDTO) {
    this.accounts.update(+id,updateAcc)
  }

  remove(id: number) {
    return `This action removes a #${id} userAccount`;
  }
}
