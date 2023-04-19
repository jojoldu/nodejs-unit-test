import { userRepository } from '../userRepository';

import { log } from '../../log';

export async function validateSignIn(id: string, password: string) {
  const matchResult = await userRepository.validateSignIn(id, password);

  if(!matchResult.isMatch) {
    log.warn(`id=${id} 의 로그인 정보가 정확하지 않습니다.`);
    throw new Error('Invalid credentials');
  }

  if(matchResult.failCount > 5) {
    log.error(`id=${id} 의 로그인 실패 횟수가 5회를 초과했습니다.`);
    throw new Error('로그인 실패 횟수 초과로 30분간 로그인을 시도할 수 없습니다.');
  }
}