
export const userRepository = {
  validateSignIn: (id: string, password: string) => {
    return Promise.resolve({
      failCount: 3,
      isMatch: true
    });
  }
}
