const commonStyles = {
  alertStyle: { mr: 1, my: 2 } as const,
  spacingStyle: { m: 1, mx: 'auto' } as const,
  spacingStyleNormal: { m: 1, mx: 'auto', fontWeight: 'normal' } as const,
};

const listTableStyles = {
  rowStyles: { '&:last-child td, &:last-child th': { border: 0 } } as const,
};

const popupStyles = {
  dialogContentStyle: { width: 500 } as const,

  popupBoxStyle: {
    display: 'flex',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    m: 1,
  } as const,
};

const viewerStyles = {
  commonBoxStyles: {
    backgroundColor: 'white',
    borderRadius: '9px',
    height: '2rem',
    textAlign: 'center',
  } as const,
};

export { commonStyles, listTableStyles, popupStyles, viewerStyles };
