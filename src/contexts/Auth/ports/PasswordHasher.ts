export interface IpasswordHasher {
        hash(plainPassoword: string): Promise<string>;

        compare(
                plainPassoword: string,
                hashedPassword: string
        ): Promise<boolean>;
}
