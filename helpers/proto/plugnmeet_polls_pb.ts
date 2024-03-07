// @generated by protoc-gen-es v1.4.1 with parameter "target=ts,import_extension=.ts"
// @generated from file plugnmeet_polls.proto (package plugnmeet, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type {
  BinaryReadOptions,
  FieldList,
  JsonReadOptions,
  JsonValue,
  PartialMessage,
  PlainMessage,
} from '@bufbuild/protobuf';
import { Message, proto3, protoInt64 } from '@bufbuild/protobuf';

/**
 * @generated from message plugnmeet.CreatePollReq
 */
export class CreatePollReq extends Message<CreatePollReq> {
  /**
   * @generated from field: string room_id = 1;
   */
  roomId = '';

  /**
   * @generated from field: string user_id = 2;
   */
  userId = '';

  /**
   * @generated from field: string poll_id = 3;
   */
  pollId = '';

  /**
   * @generated from field: string question = 4;
   */
  question = '';

  /**
   * @generated from field: repeated plugnmeet.CreatePollOptions options = 5;
   */
  options: CreatePollOptions[] = [];

  constructor(data?: PartialMessage<CreatePollReq>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.CreatePollReq';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'room_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'user_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'poll_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 4, name: 'question', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 5,
      name: 'options',
      kind: 'message',
      T: CreatePollOptions,
      repeated: true,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): CreatePollReq {
    return new CreatePollReq().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): CreatePollReq {
    return new CreatePollReq().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): CreatePollReq {
    return new CreatePollReq().fromJsonString(jsonString, options);
  }

  static equals(
    a: CreatePollReq | PlainMessage<CreatePollReq> | undefined,
    b: CreatePollReq | PlainMessage<CreatePollReq> | undefined
  ): boolean {
    return proto3.util.equals(CreatePollReq, a, b);
  }
}

/**
 * @generated from message plugnmeet.CreatePollOptions
 */
export class CreatePollOptions extends Message<CreatePollOptions> {
  /**
   * @generated from field: uint32 id = 1;
   */
  id = 0;

  /**
   * @generated from field: string text = 2;
   */
  text = '';

  constructor(data?: PartialMessage<CreatePollOptions>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.CreatePollOptions';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'id', kind: 'scalar', T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: 'text', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): CreatePollOptions {
    return new CreatePollOptions().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): CreatePollOptions {
    return new CreatePollOptions().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): CreatePollOptions {
    return new CreatePollOptions().fromJsonString(jsonString, options);
  }

  static equals(
    a: CreatePollOptions | PlainMessage<CreatePollOptions> | undefined,
    b: CreatePollOptions | PlainMessage<CreatePollOptions> | undefined
  ): boolean {
    return proto3.util.equals(CreatePollOptions, a, b);
  }
}

/**
 * @generated from message plugnmeet.PollInfo
 */
export class PollInfo extends Message<PollInfo> {
  /**
   * @generated from field: string id = 1;
   */
  id = '';

  /**
   * @generated from field: string room_id = 2;
   */
  roomId = '';

  /**
   * @generated from field: string question = 3;
   */
  question = '';

  /**
   * @generated from field: repeated plugnmeet.CreatePollOptions options = 4;
   */
  options: CreatePollOptions[] = [];

  /**
   * @generated from field: bool is_running = 5;
   */
  isRunning = false;

  /**
   * @generated from field: int64 created = 6;
   */
  created = protoInt64.zero;

  /**
   * @generated from field: string created_by = 7;
   */
  createdBy = '';

  /**
   * @generated from field: string closed_by = 8;
   */
  closedBy = '';

  constructor(data?: PartialMessage<PollInfo>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.PollInfo';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'room_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'question', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 4,
      name: 'options',
      kind: 'message',
      T: CreatePollOptions,
      repeated: true,
    },
    { no: 5, name: 'is_running', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
    { no: 6, name: 'created', kind: 'scalar', T: 3 /* ScalarType.INT64 */ },
    { no: 7, name: 'created_by', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 8, name: 'closed_by', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): PollInfo {
    return new PollInfo().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): PollInfo {
    return new PollInfo().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): PollInfo {
    return new PollInfo().fromJsonString(jsonString, options);
  }

  static equals(
    a: PollInfo | PlainMessage<PollInfo> | undefined,
    b: PollInfo | PlainMessage<PollInfo> | undefined
  ): boolean {
    return proto3.util.equals(PollInfo, a, b);
  }
}

/**
 * @generated from message plugnmeet.SubmitPollResponseReq
 */
export class SubmitPollResponseReq extends Message<SubmitPollResponseReq> {
  /**
   * @generated from field: string room_id = 1;
   */
  roomId = '';

  /**
   * @generated from field: string user_id = 2;
   */
  userId = '';

  /**
   * @generated from field: string name = 3;
   */
  name = '';

  /**
   * @generated from field: string poll_id = 4;
   */
  pollId = '';

  /**
   * @generated from field: uint64 selected_option = 5;
   */
  selectedOption = protoInt64.zero;

  constructor(data?: PartialMessage<SubmitPollResponseReq>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.SubmitPollResponseReq';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'room_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'user_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'name', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 4, name: 'poll_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 5,
      name: 'selected_option',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): SubmitPollResponseReq {
    return new SubmitPollResponseReq().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): SubmitPollResponseReq {
    return new SubmitPollResponseReq().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): SubmitPollResponseReq {
    return new SubmitPollResponseReq().fromJsonString(jsonString, options);
  }

  static equals(
    a: SubmitPollResponseReq | PlainMessage<SubmitPollResponseReq> | undefined,
    b: SubmitPollResponseReq | PlainMessage<SubmitPollResponseReq> | undefined
  ): boolean {
    return proto3.util.equals(SubmitPollResponseReq, a, b);
  }
}

/**
 * @generated from message plugnmeet.ClosePollReq
 */
export class ClosePollReq extends Message<ClosePollReq> {
  /**
   * @generated from field: string room_id = 1;
   */
  roomId = '';

  /**
   * @generated from field: string user_id = 2;
   */
  userId = '';

  /**
   * @generated from field: string poll_id = 3;
   */
  pollId = '';

  constructor(data?: PartialMessage<ClosePollReq>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.ClosePollReq';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'room_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 2, name: 'user_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'poll_id', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): ClosePollReq {
    return new ClosePollReq().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): ClosePollReq {
    return new ClosePollReq().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): ClosePollReq {
    return new ClosePollReq().fromJsonString(jsonString, options);
  }

  static equals(
    a: ClosePollReq | PlainMessage<ClosePollReq> | undefined,
    b: ClosePollReq | PlainMessage<ClosePollReq> | undefined
  ): boolean {
    return proto3.util.equals(ClosePollReq, a, b);
  }
}

/**
 * @generated from message plugnmeet.PollResponsesResultOptions
 */
export class PollResponsesResultOptions extends Message<PollResponsesResultOptions> {
  /**
   * @generated from field: uint64 id = 1;
   */
  id = protoInt64.zero;

  /**
   * @generated from field: string text = 2;
   */
  text = '';

  /**
   * @generated from field: uint64 vote_count = 3;
   */
  voteCount = protoInt64.zero;

  constructor(data?: PartialMessage<PollResponsesResultOptions>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.PollResponsesResultOptions';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'id', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
    { no: 2, name: 'text', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    { no: 3, name: 'vote_count', kind: 'scalar', T: 4 /* ScalarType.UINT64 */ },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): PollResponsesResultOptions {
    return new PollResponsesResultOptions().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): PollResponsesResultOptions {
    return new PollResponsesResultOptions().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): PollResponsesResultOptions {
    return new PollResponsesResultOptions().fromJsonString(jsonString, options);
  }

  static equals(
    a:
      | PollResponsesResultOptions
      | PlainMessage<PollResponsesResultOptions>
      | undefined,
    b:
      | PollResponsesResultOptions
      | PlainMessage<PollResponsesResultOptions>
      | undefined
  ): boolean {
    return proto3.util.equals(PollResponsesResultOptions, a, b);
  }
}

/**
 * @generated from message plugnmeet.PollResponsesResult
 */
export class PollResponsesResult extends Message<PollResponsesResult> {
  /**
   * @generated from field: string question = 1;
   */
  question = '';

  /**
   * @generated from field: uint64 total_responses = 2;
   */
  totalResponses = protoInt64.zero;

  /**
   * @generated from field: repeated plugnmeet.PollResponsesResultOptions options = 3;
   */
  options: PollResponsesResultOptions[] = [];

  constructor(data?: PartialMessage<PollResponsesResult>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.PollResponsesResult';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'question', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 2,
      name: 'total_responses',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
    },
    {
      no: 3,
      name: 'options',
      kind: 'message',
      T: PollResponsesResultOptions,
      repeated: true,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): PollResponsesResult {
    return new PollResponsesResult().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): PollResponsesResult {
    return new PollResponsesResult().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): PollResponsesResult {
    return new PollResponsesResult().fromJsonString(jsonString, options);
  }

  static equals(
    a: PollResponsesResult | PlainMessage<PollResponsesResult> | undefined,
    b: PollResponsesResult | PlainMessage<PollResponsesResult> | undefined
  ): boolean {
    return proto3.util.equals(PollResponsesResult, a, b);
  }
}

/**
 * @generated from message plugnmeet.PollsStats
 */
export class PollsStats extends Message<PollsStats> {
  /**
   * @generated from field: uint64 total_polls = 1;
   */
  totalPolls = protoInt64.zero;

  /**
   * @generated from field: uint64 total_running = 2;
   */
  totalRunning = protoInt64.zero;

  constructor(data?: PartialMessage<PollsStats>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.PollsStats';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    {
      no: 1,
      name: 'total_polls',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
    },
    {
      no: 2,
      name: 'total_running',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): PollsStats {
    return new PollsStats().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): PollsStats {
    return new PollsStats().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): PollsStats {
    return new PollsStats().fromJsonString(jsonString, options);
  }

  static equals(
    a: PollsStats | PlainMessage<PollsStats> | undefined,
    b: PollsStats | PlainMessage<PollsStats> | undefined
  ): boolean {
    return proto3.util.equals(PollsStats, a, b);
  }
}

/**
 * @generated from message plugnmeet.PollResponse
 */
export class PollResponse extends Message<PollResponse> {
  /**
   * @generated from field: bool status = 1;
   */
  status = false;

  /**
   * @generated from field: string msg = 2;
   */
  msg = '';

  /**
   * @generated from field: optional string poll_id = 3;
   */
  pollId?: string;

  /**
   * @generated from field: optional uint64 total_responses = 4;
   */
  totalResponses?: bigint;

  /**
   * @generated from field: optional uint64 voted = 5;
   */
  voted?: bigint;

  /**
   * @generated from field: map<string, string> responses = 6;
   */
  responses: { [key: string]: string } = {};

  /**
   * @generated from field: repeated plugnmeet.PollInfo polls = 7;
   */
  polls: PollInfo[] = [];

  /**
   * @generated from field: optional plugnmeet.PollsStats stats = 8;
   */
  stats?: PollsStats;

  /**
   * @generated from field: optional uint64 total_polls = 9;
   */
  totalPolls?: bigint;

  /**
   * @generated from field: optional uint64 total_running = 10;
   */
  totalRunning?: bigint;

  /**
   * @generated from field: optional plugnmeet.PollResponsesResult poll_responses_result = 11;
   */
  pollResponsesResult?: PollResponsesResult;

  constructor(data?: PartialMessage<PollResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = 'plugnmeet.PollResponse';
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: 'status', kind: 'scalar', T: 8 /* ScalarType.BOOL */ },
    { no: 2, name: 'msg', kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    {
      no: 3,
      name: 'poll_id',
      kind: 'scalar',
      T: 9 /* ScalarType.STRING */,
      opt: true,
    },
    {
      no: 4,
      name: 'total_responses',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
      opt: true,
    },
    {
      no: 5,
      name: 'voted',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
      opt: true,
    },
    {
      no: 6,
      name: 'responses',
      kind: 'map',
      K: 9 /* ScalarType.STRING */,
      V: { kind: 'scalar', T: 9 /* ScalarType.STRING */ },
    },
    { no: 7, name: 'polls', kind: 'message', T: PollInfo, repeated: true },
    { no: 8, name: 'stats', kind: 'message', T: PollsStats, opt: true },
    {
      no: 9,
      name: 'total_polls',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
      opt: true,
    },
    {
      no: 10,
      name: 'total_running',
      kind: 'scalar',
      T: 4 /* ScalarType.UINT64 */,
      opt: true,
    },
    {
      no: 11,
      name: 'poll_responses_result',
      kind: 'message',
      T: PollResponsesResult,
      opt: true,
    },
  ]);

  static fromBinary(
    bytes: Uint8Array,
    options?: Partial<BinaryReadOptions>
  ): PollResponse {
    return new PollResponse().fromBinary(bytes, options);
  }

  static fromJson(
    jsonValue: JsonValue,
    options?: Partial<JsonReadOptions>
  ): PollResponse {
    return new PollResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(
    jsonString: string,
    options?: Partial<JsonReadOptions>
  ): PollResponse {
    return new PollResponse().fromJsonString(jsonString, options);
  }

  static equals(
    a: PollResponse | PlainMessage<PollResponse> | undefined,
    b: PollResponse | PlainMessage<PollResponse> | undefined
  ): boolean {
    return proto3.util.equals(PollResponse, a, b);
  }
}
