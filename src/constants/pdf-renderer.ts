type PdfZoomOption = {
    label: string;
    value: number
}

export const PdfZoomOptions: PdfZoomOption[] = [

    {
        label: '100%',
        value: 1
    },
    {
        label: '150%',
        value: 1.5
    },
    {
        label: '200%',
        value: 2
    },
]


type PdfRotateOption = {
    label: string;
    value: number
}

export const PdfRotateOptions: PdfRotateOption[] = [
    {
        label: '90deg',
        value: 90
    },
    {
        label: '180deg',
        value: 180
    },
    {
        label: '270deg',
        value: 270
    },
    {
        label: '360deg',
        value: 360
    },
]