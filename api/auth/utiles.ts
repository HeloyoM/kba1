import { getUserByEmailAdd } from './users';

const userDoesntExist = async (email: string): Promise<boolean> => {
    const user = await getUserByEmailAdd(email);

    return user.empty; /** True if there are no documents in the `QuerySnapshot`. */
}


export {
    userDoesntExist
}
