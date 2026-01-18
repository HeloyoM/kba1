import { getUserByEmailAdd } from './users';

const userNotAssignedYet = async (email: string): Promise<boolean> => {
    const user = await getUserByEmailAdd(email);

    return user.empty;
}


export {
    userNotAssignedYet
}
