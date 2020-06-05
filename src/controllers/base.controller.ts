import { NotFoundException } from '@nestjs/common';

/**
 * A base controller type.
 */
export class BaseController {
    /**
     * Returns {value} if {value} is not undefined; otherwise throws a {NotFoundException}.
     * @param value Value.
     * @param message Exception message.
     * @throws NotFoundException
     */
    protected okOrNotFound<T>(value: T | undefined, message: string): T {
        if (value) {
            return value;
        } else {
            throw new NotFoundException(message);
        }
    }
}