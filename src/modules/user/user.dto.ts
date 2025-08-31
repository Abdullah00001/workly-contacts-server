import { BaseDTO } from '@/core/base_classes/dto.base';
import { TImage } from '@/modules/contacts/contacts.interfaces';
import IUser from '@/modules/user/user.interfaces';

/**
 * DTO for returning user data in API responses.
 * Extends BaseDTO to ensure consistent entity-to-DTO conversion.
 *
 * @extends BaseDTO<IUser>
 */
export class CreateUserResponseDTO extends BaseDTO<IUser> {
  /** Unique user identifier */
  public _id: string;

  /** User's full name */
  public name: string;

  /** User's email address */
  public email: string;

  /** User's avatar image */
  public avatar: TImage;

  /**
   * Maps IUser entity to CreateUserResponseDTO.
   * @param user - Source user entity
   */
  constructor(user: IUser) {
    super(user);
    this._id = user._id as string;
    this.name = user.name;
    this.email = user.email;
    this.avatar = user.avatar;
  }
}
