<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="strPathToRoot" />
	<xsl:param name="strCallCenterPhone" />
	<xsl:param name="strCallCenterEmail" />
	<xsl:param name="NoOfTopics">
       <xsl:value-of select="count(//topic)"/>
    </xsl:param>
	<xsl:param name="strDefaultHelpUrl" />
    <xsl:variable name="tocThreshold" select="5" />
	<xsl:template match="/">
		<table width="95%" border="0" cellspacing="0" cellpadding="0" align="center">					
			<tr> 
				<td class="normal" colspan="1" align="left" height="20" bgColor="#ffffff">
					<a name="Top">
						<xsl:attribute name="href">
							<xsl:choose>
								<xsl:when test="$strDefaultHelpUrl = ''">
									<xsl:value-of select="concat($strPathToRoot,'Help/hlpTOC.asp')"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="concat($strPathToRoot,$strDefaultHelpUrl)"/>
								</xsl:otherwise>
							</xsl:choose>
						</xsl:attribute>
						View All Topics
					</a>
					<br/><br/>
				</td>	
			</tr>
			<tr> 
				<td class="normal">
					Following information is available for this topic. To view all topics click on 'View All Topics' link above.
					If your question is still not answered, contact HRSA Call Center at <xsl:value-of select="$strCallCenterPhone"/> or email 
					<A><xsl:attribute name="href"><xsl:value-of select="concat('mailto:',$strCallCenterEmail)"/></xsl:attribute><xsl:value-of select="$strCallCenterEmail"/></A> or click on the questions/comments link above.
				</td>	
			</tr>	
		</table>
		<br/>
		<table width="95%" border="0" align="center" cellspacing="0" cellpadding="0">					
			<tr>
				<td bgcolor="#000000">		
					<table width="100%" border="0" cellspacing="1" cellpadding="3">					
						<tr> 
							<td class="headerMain" colspan="1" align="left" height="20" bgColor="#ffffff">
								Help - <xsl:value-of select="helpPage/@title"/>
							</td>	
						</tr>
						<xsl:choose>
							<xsl:when test="$NoOfTopics > $tocThreshold">
								<tr align="center">
									<td bgcolor="#FFFFFF"><br/>
										<table width="95%" border="0" cellspacing="1" cellpadding="3" bgColor="#000000">	
											<tr> 
												<td class="headerSec" colspan="1" align="left" height="20" bgColor="#ffffff">
													Topics
												</td>	
											</tr>
											<tr align="left">
												<td class="bgWhite" height="20" colspan="1" bgcolor="#ffffff">
													<table width="95%" border="0" cellspacing="1" cellpadding="3">
														<xsl:apply-templates select="helpPage/topic/title" />
													</table>
												</td>
											</tr>		
										</table>
										<br/>
										<table width="95%" border="0" cellspacing="1" cellpadding="3" bgColor="#000000">	
											<tr> 
												<td class="headerSec" colspan="1" align="left" height="20" bgColor="#ffffff">
													Discussions
												</td>	
											</tr>
											<xsl:apply-templates select="helpPage/topic" />
										</table>
										<br/>
									</td>
								</tr>
							</xsl:when>
							<xsl:otherwise>
								<xsl:apply-templates select="helpPage/topic" />
							</xsl:otherwise>
						</xsl:choose>	
					</table>
				</td>
			</tr>
		</table> 	
	</xsl:template>
	<xsl:template match="topic">
		<tr align="left">
		    <td class="headerTertiary" height="20" colspan="1" bgcolor="#ffffff">
				<a class="informationMsg">
					<xsl:attribute name="name">
						<xsl:value-of select="@name"/>
					</xsl:attribute> 
					<xsl:value-of select="title"/>
				</a>
				<xsl:if test="$NoOfTopics > $tocThreshold">
					<a href="#Top">
						[Top]
					</a>
				</xsl:if>
			</td>
		</tr>
		<tr align="left">
		    <td class="bgWhite" height="20" colspan="1" bgcolor="#ffffff">
				<div class="textSmall">
					<xsl:value-of disable-output-escaping="yes" select="helpText"/>
				</div>
			</td>
		</tr>
	</xsl:template>
	<xsl:template match="title">
		<tr>
			<td>
				<a class="informationMsg">
					<xsl:attribute name="href">
						#<xsl:value-of select="./../@name"/>
					</xsl:attribute> 
					<xsl:value-of select="./."/>
				</a>
			</td>
		</tr>
	</xsl:template>
</xsl:stylesheet>
