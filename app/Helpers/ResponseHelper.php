<?php

namespace App\Helpers;

class ResponseHelper
{

    const BAD_REQUEST_INPUT = [
        'code' => 400,
        'data' => [
            'errors' => [
                'Bad Request Input',
                'ID must be number alphabetic not allowed',
            ],
        ],
    ];

    const INVALID_ID = [
        'code' => 204,
        'data' => [
            'errors' => [
                'ID is not valid',
            ],
        ],
    ];

    const ITEM_ALREADY_EXIST = [
        'code' => 409,
        'data' => [
            'errors' => ['Item Already Exist'],
        ],
    ];

    const EMPTY_RESPONSE = [
        'code' => 204,
        'data' => [
            'errors' => ['Nothing to show'],
        ],
    ];

    public static function isNumeric($id)
    {
        return is_numeric($id);
    }

    public static function validationErrorResponse($validator)
    {
        return [
            'code' => 400,
            'data' => $validator->errors(),
        ];
    }

    public static function outActiveCycleDateRange($start, $end)
    {
        return [
            'code' => 400,
            'data' => [
                'errors' => [
                    "Date must be between $start and $end",
                ],
            ],
        ];
    }

    public static function dateAfterTodayError()
    {
        return [
            'code' => 400,
            'data' => [
                'errors' => [
                    "Date cannot be after " . date('20y-m-d'),
                ],
            ],
        ];
    }

    public static function InvalidDateRange($date, $interval)
    {
        return [
            'code' => 400,
            'data' => [
                'errors' => [
                    "Date $date exceed $interval day limit",
                ],
            ],
        ];
    }
}
