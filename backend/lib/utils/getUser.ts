import { get, has, set } from "lodash";
import { verify } from "@lib/jwt";
import { db } from "@database";

interface Permission {
    type: string;
    operation?: string;
    target?: string;
}

function parsePermissions(permissionsArray: Permission[]): {} | true {
    if (permissionsArray.length > 0 && permissionsArray[0].type == "*")
        return true;

    const permissionObject = {};

    for (const permission of permissionsArray) {
        if (permission.operation) {
            if (permission.target) {
                if (
                    has(permissionObject, [
                        permission.type,
                        permission.operation,
                    ])
                ) {
                    permissionObject[permission.type][
                        permission.operation
                    ].push(permission.target);
                } else {
                    set(
                        permissionObject,
                        [permission.type, permission.operation],
                        [permission.target],
                    );
                }
            } else {
                set(
                    permissionObject,
                    [permission.type, permission.operation],
                    true,
                );
            }
        } else {
            set(permissionObject, permission.type, true);
        }
    }

    return permissionObject;
}

export default async function getUser(jwt: string): Promise<{}> {
    if (jwt) {
        const payload = await verify(jwt);

        if (payload) {
            const user = await db("user")
                .select("*")
                .where("id", payload.id)
                .first();

            user.permissions = parsePermissions(
                await db
                    .select("permission.*")
                    .from("permission")
                    .innerJoin(
                        "permission_role",
                        "permission_role.permission_id",
                        "permission.id",
                    )
                    .where("permission_role.role_id", user.role_id),
            );

            return user;
        }
    }

    return null;
}
