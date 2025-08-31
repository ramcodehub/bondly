import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MetricTooltip } from '../metric-tooltip'

describe('MetricTooltip', () => {
  const mockChildren = <div>Hover me</div>
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    linkHref: '/test',
    linkText: 'View Details',
    children: mockChildren
  }

  it('renders children correctly', () => {
    render(<MetricTooltip {...defaultProps} />)
    expect(screen.getByText('Hover me')).toBeInTheDocument()
  })

  it('shows tooltip on hover', () => {
    render(<MetricTooltip {...defaultProps} />)
    const trigger = screen.getByText('Hover me')
    
    fireEvent.mouseEnter(trigger)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('View Details')).toBeInTheDocument()
  })

  it('shows detailed data in dialog when View Popup is clicked', () => {
    const detailedData = [
      { name: 'Item 1', value: 'Value 1' },
      { name: 'Item 2', value: 'Value 2' }
    ]
    
    const dataColumns = [
      { key: 'name', label: 'Name' },
      { key: 'value', label: 'Value' }
    ]

    render(
      <MetricTooltip 
        {...defaultProps}
        detailedData={detailedData}
        dataColumns={dataColumns}
      />
    )
    
    const trigger = screen.getByText('Hover me')
    fireEvent.mouseEnter(trigger)
    
    // Click the "View Popup" button
    const viewPopupButton = screen.getByText('View Popup')
    fireEvent.click(viewPopupButton)
    
    // Check if dialog is open with detailed data
    expect(screen.getByText('Test Title Details')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })
})